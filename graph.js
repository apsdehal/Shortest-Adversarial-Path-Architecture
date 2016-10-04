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
}

Graph.prototype.addEdge = function(x, y) {
  this.edgeNumber[(new EdgeWithoutCost(x, y))] = this.edges.length;
  this.edges.push(new Edge(x, y, 1));
}

Graph.prototype.doubleCost = function(x, y) {
  var edgeNo = this.getEdgeNumber(x, y);
  this.edges[edgeNo].cost *= 2;
}

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
