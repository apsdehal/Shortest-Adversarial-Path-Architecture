var net = require('net');
module.exports = DriverConnectionHandler;

function DriverConnectionHandler() {
  this.sock = null;
}

DriverConnectionHandler.prototype.init = function (cb) {
  var self = this;
  net.createServer(function (sock) {
      if (!self.sock) {
        self.sock = sock;
        cb();
        self.sock.write('start');
      }
  }).listen(5001);
}

DriverConnectionHandler.prototype.listen = function (callback) {
  var self = this;
  this.sock.on('data', function (data) {
    callback(data.toString());
  });

  this.sock.on('error', function (data) {
    console.log('Ignoring exception', data);
    self.sock = null;
  })
}

DriverConnectionHandler.prototype.write = function (data) {
  if (!this.sock) {
    return;
  }
  this.sock.write(data);
}
