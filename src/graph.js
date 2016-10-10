var strint = require('./lib/strint');
module.exports = Graph;

function Edge(x, y, cost) {
  this.x = x;
  this.y = y;
  this.cost = cost;
}

function Graph() {
  this.edges = [];
  this.edgeNumber = {};
  this.adjacencyList = {};
}

Graph.prototype.addEdge = function(x, y) {
  this.edgeNumber[x + " " + y] = this.edges.length;
  this.edges.push(new Edge(x, y, '1'));

  if (!this.adjacencyList[x]) {
    this.adjacencyList[x] = [y];
  } else {
    this.adjacencyList[x].push(y);
  }

  if (!this.adjacencyList[y]) {
    this.adjacencyList[y] = [x];
  } else {
    this.adjacencyList[y].push(x);
  }
}

Graph.prototype.doubleCost = function(x, y) {
  var edgeNo = this.getEdgeNumber(x, y);
  this.edges[edgeNo].cost = strint.mul(this.edges[edgeNo].cost, '2');
  return this.edges[edgeNo].cost;
}

Graph.prototype.getEdgeCost = function (x, y) {
  // We assume validity has been checked already
  return this.edges[this.getEdgeNumber(x, y)].cost;
};

Graph.prototype.getEdgeNumber = function(x, y) {
  var edge = x + " " + y;
  var reverseEdge = y + " " + x;

  var ret;
  if (this.edgeNumber[edge] || this.edgeNumber[edge] === 0) {
    ret = this.edgeNumber[edge];
  } else if (this.edgeNumber[reverseEdge] || this.edgeNumber[reverseEdge] === 0) {
    ret = this.edgeNumber[reverseEdge];
  } else {
    // We didn't find the edge
    ret = -1;
  }
  delete edge, reverseEdge;
  return ret;
}

Graph.prototype.validEdge = function(x, y) {
  return this.adjacencyList[x].indexOf(y) > -1 ? 1 : 0;
}
