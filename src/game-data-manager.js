module.exports = new GameDataManager();

var strint = require('./lib/strint');
var Graph = require('./graph.js');
const chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));


function GameDataManager() {
  this.graph;
  this.startPoint;
  this.playerOnePosition;
  this.endPoint;
  this.originalData;
  this.playerBill = '0';
}

GameDataManager.prototype.initialize = function (data) {
  this.originalData = data;

  this.graph = new Graph();

  data = data.split('\n');
  var startPoint = data[0].split(' ')[2];
  var endPoint = data[1].split(' ')[2];

  this.startPoint = startPoint;
  this.endPoint = endPoint;
  this.playerOnePosition = this.startPoint;
  this.playerBill = '0';

  data.splice(0, 3);

  var curr;
  for(var i = 0; i < data.length; i++) {
    if (!data[i]) {
      continue;
    }
    curr = data[i].split(' ');
    this.graph.addEdge(curr[0].trim(), curr[1].trim());
  }
}

GameDataManager.prototype.setPlayerOnePosition = function(y) {
  this.addBill(y);
  this.playerOnePosition = y;

  if (this.endPoint === this.playerOnePosition){
    return true;
  } else {
    return false;
  }
};

GameDataManager.prototype.getPlayerOnePosition = function() {
  return this.playerOnePosition;
}

GameDataManager.prototype.doubleEdgeCost = function (x, y) {
  return this.graph.doubleCost(x, y);
};

GameDataManager.prototype.addBill = function(y) {
  var self = this;
  this.playerBill = strint.add(this.playerBill,
    this.graph.getEdgeCost(this.playerOnePosition, y));
};

GameDataManager.prototype.reset = function () {
  this.playerOnePosition = this.startPoint;
  this.playerBill = '0';
  this.initialize(this.originalData);
};

GameDataManager.prototype.validateMove = function (name, x, y) {
  if (!y) {
    if (argv.v)
      console.log(chalk.green(name, 'wants to move to', x));
    y = x;
    x = this.playerOnePosition;
  } else {
    if (argv.v)
      console.log(chalk.green(name, 'has doubled', x, y));
  }

  return this.graph.validEdge(x, y);
};

GameDataManager.prototype.showFinalCost = function (data) {
  console.log(chalk.red("Final cost of", data.player, "is", this.playerBill));
  data.db.finalizeMatch(data.player, data.adversary, this.playerBill);
  return this.playerBill;
}
