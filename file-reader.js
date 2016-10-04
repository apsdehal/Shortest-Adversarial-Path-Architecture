module.exports = new FileReader();

var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

function FileReader() {
  this.data;
}

FileReader.prototype.readFile = function (filename) {
  if (!filename) {
      filename = './advshort';

      if (argv.f) {
        filename = argv.f;
      }
  }
  this.data = fs.readFileSync(filename).toString();
};
