module.exports = new IOHandler();

function IOHandler() {
  this.sock = null;
  this.io = null;
}

IOHandler.prototype.init = function (io) {
  var self = this;
  self.io = io;
  io.on('connection', function (socket) {
    // We will only receive connection from one client
    if (this.sock) {
      return;
    }

    self.sock = socket.id;
  });
}

IOHandler.prototype.send = function (name, data) {
  var self = this;
  if (self.io.sockets.connected[self.sock]) {
    self.io.sockets.connected[self.sock].emit(name, data);
  }
}
