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

ConnectionHandler.prototype.handleConnections = function (sock) {
  if (!this.playerOneActive) {
    this.playerOneSock = sock
    this.playerOneActive = true;
    return;
  }

  if (!this.playerTwoActive) {
    this.playerTwoSock = sock;
    this.playerTwoActive = true;
    this.gameActive = true;
    return;
  }

  // Ignore rest connections for now
  return;
};
