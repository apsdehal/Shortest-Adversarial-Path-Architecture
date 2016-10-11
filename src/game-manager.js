var gameData = require('./game-data-manager');
var DB = require('./db');
module.exports = new GameManager();

function GameManager() {
  this.gameData = gameData;
  this.db = new DB();
  this.playerName = 'Player';
  this.adversaryName = 'Adversary';
  this.ioHandler;
}

GameManager.prototype.initializeGame = function(data, ioHandler) {
  this.gameData.initialize(data);
  this.ioHandler = ioHandler;
}

GameManager.prototype.startInteraction = function(connHandler) {
  var self = this;
  this.gameData.reset();
  connHandler.sendFile(self.gameData.originalData);

  connHandler.startConversation(self);
}

GameManager.prototype.playerOneMove = function(y, connHandler) {
  y = y.split(' ').map(function (x) {
    // Checking for safety
    return x.trim();
  });

  y = y[0];

  if (!this.validateMove(y, 1)) {
    connHandler.notifyPlayerTwo(this.gameData.getPlayerOnePosition());
    return false;
  }

  var result = this.gameData.setPlayerOnePosition(y);

  if (!result) {
    connHandler.notifyPlayerTwo(y);
  } else {
    this.notifyEndGame(connHandler);
  }

  return result;
};

GameManager.prototype.playerTwoMove = function(data, connHandler) {
  data = data.split(' ').map(function (x) {
    return x.trim();
  });

  if (!this.validateMove(data, 2)) {
    connHandler.notifyPlayerOne('-1 -1 -1');
    return false;
  }

  data.push(this.gameData.doubleEdgeCost(data[0], data[1]));

  connHandler.notifyPlayerOne(data.join(' '));
  return 0;
}

GameManager.prototype.validateMove = function (data, player) {
  if (data.length === 0) {
    return false;
  }

  if (player === 1) {
    return this.gameData.validateMove(this.playerName, data)
  } else {
    if (data.length !== 2) {
      return false;
    }
    return this.gameData.validateMove(this.adversaryName, data[0], data[1]);
  }
};

GameManager.prototype.notifyEndGame = function (connHandler) {
  var finalCost = this.gameData.showFinalCost({
    db: this.db,
    player: this.playerName,
    adversary: this.adversaryName
  });

  this.ioHandler.send('result', {
    player: this.playerName,
    adversary: this.adversaryName,
    cost: finalCost
  });

  this.ioHandler.send('scores', {
    data: this.db.getTeams()
  })

  this.db.incrementTeamScoreBasedOnMatch(this.playerName, this.adversaryName);

  this.gameData.reset();
  connHandler.notifyGameEnd();
};

GameManager.prototype.insertMatch = function (playerName, adversaryName) {
  this.playerName = playerName;
  this.adversaryName = adversaryName;

  if (this.ioHandler) {
    this.ioHandler.send('match', {player: playerName, adversary: adversaryName})
  }
  var db = this.db;
  db.insertTeam(playerName);
  db.insertTeam(adversaryName);
  db.insertMatch(playerName, adversaryName);
}
