module.exports = Graph;

function Edge(x, y, cost) {
  this.x = x;
  this.y = y;
  this.cost = cost;
}

function EdgeWithoutCost(x, y) {
  this.x = x;
  this.y = y;
}

function Graph() {
  this.edges = [];
  this.edgeNumber = {};
  this.adjancencyList = {};
}

Graph.prototype.addEdge = function(x, y) {
  this.edgeNumber[(new EdgeWithoutCost(x, y))] = this.edges.length;
  this.edges.push(new Edge(x, y, 1));
  this.adjacencyList[x] = this.adjacencyList[x].length ? this.adjacencyList[x].push(y) : [y];
  this.adjacencyList[y] = this.adjacencyList[y].length ? this.adjacencyList[y].push(x) : [x];
}

Graph.prototype.doubleCost = function(x, y) {
  var edgeNo = this.getEdgeNumber(x, y);
  this.edges[edgeNo].cost *= 2;
}

Graph.prototype.getEdgeCost = function (x, y) {
  // We assume validity has been checked already
  return this.edges[this.getEdgeNumber(x, y)].cost;
};

Graph.prototype.getEdgeNumber = function(x, y) {
  var edge = new EdgeWithoutCost(x, y);
  var reverseEdge = new EdgeWithoutCost(y, x);
  var ret;
  if (this.edgeNumber[edge]) {
    ret = this.edgeNumber[edge];
  } else if (this.edgeNumber[reverseEdge]) {
    ret = this.edgeNumber[reverseEdge];
  } else {
    // We didn't find the edge
    ret = -1;
  }

  delete edge, reverseEdge;
  return edge;
}

Graph.prototype.validEdge = function(x, y) {
  return this.adjacencyList[x].includes(y);
}
