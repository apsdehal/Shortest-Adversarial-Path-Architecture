var net = require('net');
var connectionHandler = require('./src/connection-handler');
var gameManager = require('./src/game-manager');
var fileReader = require('./src/file-reader');

fileReader.readFile();

// Initial data passed to GameData class
gameManager.initializeGame(fileReader.data);

net.createServer(function (sock) {
  connectionHandler.handleConnections(sock, gameManager.startInteraction.bind(gameManager));
}).listen(5000);

console.log('Server started');
console.log('Waiting for player');

connectionHandler.driverSock.init(connectionHandler.startDriverListen);
