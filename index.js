var net = require('net');
var connectionHandler = require('./connection-handler');
var gameManager = require('./game-manager');
var fileReader = require('./file-reader');

fileReader.readFile();

// Initial data passed to GameData class
gameManager.initializeGame(fileReader.data);

net.createServer(function (sock) {
  connectionHandler.handleConnections(sock, gameManager.startInteraction.bind(gameManager));
}).listen(5000);

console.log('Server started');
console.log('Waiting for player 1');
