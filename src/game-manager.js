var gameData = require('./game-data-manager');
module.exports = new GameManager();

function GameManager() {
  this.gameData = gameData;
}

GameManager.prototype.initializeGame = function(data) {
  this.gameData.initialize(data);
}

GameManager.prototype.startInteraction = function(connHandler) {
  var self = this;
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
  if (player === 1) {
    return this.gameData.validateMove(data)
  } else {
    if (data.length !== 2) {
      return false;
    }
    return this.gameData.validateMove(data[0], data[1]);
  }
};

GameManager.prototype.notifyEndGame = function (connHandler) {
  this.gameData.showFinalCost();
  this.gameData.reset();
  connHandler.notifyGameEnd();
};
