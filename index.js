var net = require('net');
var connectionHandler = require('./src/connection-handler');
var gameManager = require('./src/game-manager');
var fileReader = require('./src/file-reader');
var ioHandler = require('./src/io-handler');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

fileReader.readFile();

ioHandler.init(io);
// Initial data passed to GameData class
gameManager.initializeGame(fileReader.data, ioHandler);

connectionHandler.setIO(ioHandler);

net.createServer(function (sock) {
  connectionHandler.handleConnections(sock, gameManager.startInteraction.bind(gameManager));
}).listen(5000);

console.log('Server started');
console.log('Waiting for player');

connectionHandler.driverSock.init(function(data) {
  connectionHandler.startDriverListen.call(connectionHandler, gameManager);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


http.listen(4444, function() {
  console.log('Express ready on 4444');
})
