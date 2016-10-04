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

GameManager.prototype.playerOneMove = function(y) {
  y = y.trim();

  if (!this.validateMove(data, 1)) {
      return 2;
  }

  return this.gameData.setPlayerOnePosition(y);
};

GameManager.prototype.playerTwoMove = function(data) {
  data = data.split(' ').map(function (x) {
    return x.trim();
  });

  if (!this.validateMove(data, 2)) {
      return 2;
  }

  return this.gameData.doubleEdgeCost(data[0], data[1]);
}

GameManager.prototype.validateMove = function (data, player) {
  if (player === 1) {
    return this.gameData.validateMove(data)
  } else {
    return this.gameData.validateMove(data[0], data[1]);
  }
};
