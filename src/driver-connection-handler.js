module.exports = DriverConnectionHandler;

var net = require('net');
function DriverConnectionHandler() {
  this.sock = null;
}

DriverConnectionHandler.prototype.init = function () {
  var self = this;
  net.createServer(function (sock) {
      if (!self.sock) {
        self.sock = sock;
        self.sock.write('start');
      }
  }).listen(5001);
}

DriverConnectionHandler.prototype,listen = function (callback) {
  this.sock.on('data', function (data) {
    callback(data.toString());
  });
}

DriverConnectionHandler.prototype.write = function (callback) {
  this.sock.write(data);
}
