module.exports = new ConnectionHandler();

function ConnectionHandler() {
    this.playerOneSock;
    this.playerTwoSock;
    this.gameActive = false;
    this.playerOneName;
    this.playerTwoName;
    this.playerOneActive = false;
    this.playerTwoActive = false;
};

ConnectionHandler.prototype.handleConnections = function (sock, cb) {
  if (!this.playerOneActive) {
    this.playerOneSock = sock
    this.playerOneActive = true;
    console.log('Waiting for player 2');
    return;
  }

  if (!this.playerTwoActive) {
    this.playerTwoSock = sock;
    this.playerTwoActive = true;
    this.gameActive = true;
    cb(this);
    return;
  }

  // Ignore rest connections for now
  return;
};

ConnectionHandler.prototype.sendFile = function(data) {
  this.playerOneSock.write(data + '#\n');
  this.playerTwoSock.write(data + '#\n');
}

ConnectionHandler.prototype.startConversation = function(gameManager) {
  this.playerOneSock.on('data', function(data) {
    var hasEnded = gameManager.firstPlayerMove(data);

    if (hasEnded) {
      this.endConnections();
    }
  })

  this.playerTwoSock.on('data', function(data) {
    
  });
}
