var gameData = require('./game-data-manager');
module.exports = new GameManager();

function GameManager() {
  this.gameData = gameData;
}

GameManager.prototype.initializeGame = function (data) {
  this.gameData.initialize(data);
}

GameManager.prototype.startInteraction = function (connHandler) {
  var self = this;
  connHandler.sendFile(self.gameData.originalData);

  connHandler.startConversation(self);
}
