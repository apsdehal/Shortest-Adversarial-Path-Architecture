var Timer = require('./timer');
var DriverConnectionHandler = require('./driver-connection-handler');
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
    this.driverSock = new DriverConnectionHandler();
    this.timer = new Timer();
    this.db;
    this.ioHandler;
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

ConnectionHandler.prototype.setName = function (data, gameManager) {
  data = data.split(' ').map(function (x) {
    return x.trim();
  })

  this.playerOneName = data[0];
  this.playerTwoName = data[1];
  this.timer.setPlayerOneName(data[0]);
  this.timer.setPlayerTwoName(data[1]);
  this.db = gameManager.db;

  gameManager.insertMatch(data[0], data[1]);
}

ConnectionHandler.prototype.sendFile = function(data) {
  this.playerOneSock.write(data + '#\n');
  this.playerTwoSock.write(data + '#\n');
};

ConnectionHandler.prototype.startDriverListen = function(gameManager) {
  var self = this;
  self.driverSock.listen(function (data) {
    self.setName(data, gameManager);
  });
}

ConnectionHandler.prototype.startConversation = function(gameManager) {
  var self = this;

  this.timer.startCounting(this, 1);

  this.playerOneSock.on('data', function(data) {
    if (!self.playerOneTurn) {
      return;
    }
    self.timer.clearPlayerTimeout(1);

    var hasEnded = false;
    try {
      hasEnded = gameManager.playerOneMove(data.toString(), self);
    } catch (e) {
      hasEnded = false;
      console.log(e);
    }

    self.playerOneTurn = false;
    self.playerTwoTurn = true;

    if (hasEnded) {
      self.endConnections();
    }

  });

  this.playerOneSock.on('error', function (exc) {
    console.log('Player one exception ignored', exc);
  })

  this.playerTwoSock.on('data', function(data) {
    if (!self.playerTwoTurn) {
      return;
    }

    self.timer.clearPlayerTimeout(2);

    try {
      gameManager.playerTwoMove(data.toString(), self);
    } catch (e) {
      console.log(e);
    }

    self.playerTwoTurn = false;
    self.playerOneTurn = true;
  });

  this.playerTwoSock.on('error', function (exc) {
    console.log('Player two Exception ignored', exc);
  })
};

ConnectionHandler.prototype.notifyPlayerOne = function(data) {
  if (!this.playerOneSock) {
    return;
  }

  this.playerOneSock.write(data);
  this.timer.startCounting(this, 1);
};

ConnectionHandler.prototype.notifyPlayerTwo = function(data) {
  if (!this.playerTwoSock) {
    return;
  }

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
  this.timer.reset();
  this.timer = new Timer();
  console.log('Waiting for player');
  this.driverSock.write('start');
};

ConnectionHandler.prototype.setIO = function (ioHandler) {
  this.ioHandler = ioHandler;
}

ConnectionHandler.prototype.endGameTimeout = function(num) {
  if (num === 1) {
    console.log(chalk.red(this.playerOneName, 'timed out'));
    this.db.incrementTeamScore(this.playerTwoName);
  } else {
    console.log(chalk.red(this.playerTwoName, 'timed out'));
    this.db.incrementTeamScore(this.playerOneName);
  }

  if (this.ioHandler) {
    this.ioHandler.send('result', {
      player: this.playerOneName,
      adversary: this.playerTwoName,
      cost: 0
    });
  }


  this.notifyGameEnd();
  this.reset();
}
