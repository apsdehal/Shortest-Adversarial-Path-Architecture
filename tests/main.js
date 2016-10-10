var fs = require('fs');
var assert = require('assert');
var gameManager = require('../src/game-manager');

describe('File Reader test', function () {
  it('should parse and return correctly formatted data', function () {
    var fileData = fs.readFileSync('./advshort');

    gameManager.initializeGame(fileData.toString());

    assert.equal(gameManager.gameData.startPoint, '165');
    assert.equal(gameManager.gameData.endPoint, '157');
    assert.equal(gameManager.gameData.playerOnePosition, '165');
    assert.equal(gameManager.gameData.playerBill, '0');
    assert.deepEqual(gameManager.gameData.graph.adjacencyList['165'],
    [ '84', '163', '73', '149', '143', '153' ]);
    assert.deepEqual(gameManager.gameData.graph.adjacencyList['153'],
    [ '25', '168', '165', '159', '75', '26', '108', '76' ]);

  });
});
