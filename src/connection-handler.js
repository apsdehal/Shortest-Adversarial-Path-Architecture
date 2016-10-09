var Timer = require('./timer');
const chalk = require('chalk');

module.exports = new ConnectionHandler();

function ConnectionHandler() {
    this.playerOneSock;
    this.playerTwoSock;
    this.gameActive = false;
    this.playerOneName;
    this.playerTwoName;
    this.playerOneActive = false;
    this.playerTwoActive = false;
    this.playerOneTurn = false;
    this.playerTwoTurn = false;
    this.timer;
};

ConnectionHandler.prototype.handleConnections = function (sock, cb) {
  if (!this.playerOneActive) {
    this.playerOneSock = sock
    this.playerOneActive = true;
    console.log('Waiting for adversary');
    return;
  }

  if (!this.playerTwoActive) {
    this.playerTwoSock = sock;
    this.playerTwoActive = true;
    this.gameActive = true;
    this.playerOneTurn = true;
    cb(this);
    return;
  }

  // Ignore rest connections for now
  return;
};

ConnectionHandler.prototype.sendFile = function(data) {
  this.playerOneSock.write(data + '#\n');
  this.playerTwoSock.write(data + '#\n');
};

ConnectionHandler.prototype.startConversation = function(gameManager) {
  var self = this;
  this.timer = new Timer();

  this.timer.startCounting(this, 1);

  this.playerOneSock.on('data', function(data) {
    if (!self.playerOneTurn) {
      return;
    }

    self.timer.clearPlayerTimeout(1);

    var hasEnded = gameManager.playerOneMove(data.toString(), self);

    self.playerOneTurn = false;
    self.playerTwoTurn = true;

    if (hasEnded) {
      self.endConnections();
    }

  })

  this.playerTwoSock.on('data', function(data) {
    if (!self.playerTwoTurn) {
      return;
    }

    self.timer.clearPlayerTimeout(2);

    gameManager.playerTwoMove(data.toString(), self);

    self.playerTwoTurn = false;
    self.playerOneTurn = true;
  });
};

ConnectionHandler.prototype.notifyPlayerOne = function(data) {
  this.playerOneSock.write(data);
  this.timer.startCounting(this, 1);
};

ConnectionHandler.prototype.notifyPlayerTwo = function(data) {
  this.playerTwoSock.write(data);
  this.timer.startCounting(this, 2);
};

ConnectionHandler.prototype.endConnections = function () {
  this.reset();
};

ConnectionHandler.prototype.notifyGameEnd = function() {
  this.notifyPlayerOne('$');
  this.timer.clear();
  this.notifyPlayerTwo('$');
  this.timer.clear();
}

ConnectionHandler.prototype.reset = function () {
  this.playerOneSock = null;
  this.playerTwoSock = null;
  this.playerOneActive = false;
  this.playerTwoActive = false;
  this.gameActive = false;
  this.timer.clear();
  this.timer = new Timer();
  console.log('Waiting for player');
};

ConnectionHandler.prototype.endGameTimeout = function(num) {
  if (num === 1) {
    console.log(chalk.red('Player timed out'));
  } else {
    console.log(chalk.red('Adversary timed out'));
  }

  this.notifyGameEnd();
  this.reset();
}
