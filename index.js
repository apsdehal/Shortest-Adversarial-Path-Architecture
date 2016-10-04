var net = require('net');
var connectionHandler = require('./connection-handler');
var gameDataManager = require('./game-data-manager');
var fileReader = require('./file-reader');

// Initial data passed to GameData class
gameData.initializeGame(fileReader.data);

net.createServer(connectionHandler.handleConnections).listen(5000);

console.log('Server started');
