module.exports = new GameDataManager();
var Graph = require('./graph.js');

function GameDataManager() {
  this.graph;
  this.startPoint;
  this.playerOnePosition;
  this.endPoint;
  this.originalData;
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

  data.splice(0, 3);

  var curr;
  for(var i = 0; i < data.length; i++) {
    curr = data[i].split(' ');
    this.graph.addEdge(curr[0], curr[1]);
  }
}
