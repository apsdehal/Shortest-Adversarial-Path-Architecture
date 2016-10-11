var fs = require('fs');
var assert = require('assert');

describe('File Reader test', function () {
  it('should parse and return correctly formatted data', function () {
    var fileData = fs.readFileSync('./advshort');
    var gameManager = require('../src/game-manager');

    gameManager.initializeGame(fileData.toString());

    assert.strictEqual(gameManager.gameData.startPoint, '165');
    assert.strictEqual(gameManager.gameData.endPoint, '157');
    assert.strictEqual(gameManager.gameData.playerOnePosition, '165');
    assert.strictEqual(gameManager.gameData.playerBill, '0');
    assert.deepEqual(gameManager.gameData.graph.adjacencyList['165'],
    [ '84', '163', '73', '149', '143', '153' ]);
    assert.deepEqual(gameManager.gameData.graph.adjacencyList['153'],
    [ '25', '168', '165', '159', '75', '26', '108', '76' ]);

  });

  it('should properly handle player one moves', function () {
    var fileData = fs.readFileSync('./advshort');
    var gameManager = require('../src/game-manager');

    gameManager.initializeGame(fileData.toString());

    var connHandler = {
      notifyPlayerTwo: function (data) {
        assert.strictEqual(data, '84');
      }
    }

    // Valid Move handling
    gameManager.playerOneMove('84', connHandler);
    assert.strictEqual(gameManager.gameData.playerOnePosition, '84');

    gameManager.playerOneMove('84 64', connHandler);
    assert.strictEqual(gameManager.gameData.playerOnePosition, '84');

    gameManager.playerOneMove('84 ', connHandler);
    assert.strictEqual(gameManager.gameData.playerOnePosition, '84');

    connHandler = {
      notifyPlayerTwo: function (data) {
        assert.strictEqual(data, '165');
      }
    }

    gameManager.playerOneMove('165', connHandler);
    assert.strictEqual(gameManager.gameData.playerOnePosition, '165');

    gameManager.playerOneMove('165 64', connHandler);
    assert.strictEqual(gameManager.gameData.playerOnePosition, '165');

    gameManager.playerOneMove('165 ', connHandler);
    assert.strictEqual(gameManager.gameData.playerOnePosition, '165');

    connHandler = {
      notifyPlayerTwo: function (data) {
        assert.strictEqual(data, '165');
      }
    }

    // Invalid move handling
    gameManager.playerOneMove('86', connHandler);

    assert.strictEqual(gameManager.gameData.playerBill, '2');

    gameManager.gameData.doubleEdgeCost('165', '84');

    var called = false;
    gameManager.notifyEndGame = function () {
      called = true;
    }

    gameManager.gameData.endPoint = '84';

    gameManager.playerOneMove('84', connHandler);

    assert.equal(called, true);

    assert.strictEqual(gameManager.gameData.playerBill, '4');
  });

  it('should properly handle player two moves', function () {
    var fileData = fs.readFileSync('./advshort');
    var gameManager = require('../src/game-manager');

    gameManager.initializeGame(fileData.toString());

    var connHandler = {
      notifyPlayerOne: function (data) {
        assert.strictEqual(data, '165 84 2');
      }
    };

    connHandler.notifyPlayerTwo = function (data) {
      assert.strictEqual(data, '84');
    }

    gameManager.playerOneMove('84', connHandler);

    connHandler.notifyPlayerTwo = function (data) {
      assert.strictEqual(data, '165');
    }

    gameManager.playerOneMove('165', connHandler);

    gameManager.playerTwoMove('165 84', connHandler);

    connHandler.notifyPlayerOne = function (data) {
      assert.strictEqual(data, '165 84 4');
    }

    gameManager.playerTwoMove('165 84', connHandler);

    connHandler.notifyPlayerOne = function (data) {
      assert.strictEqual(data, '-1 -1 -1');
    }

    // Invalid moves
    gameManager.playerTwoMove('165 83', connHandler);
    gameManager.playerTwoMove('165', connHandler);
    gameManager.playerTwoMove('', connHandler);
    gameManager.playerTwoMove('164 83 22', connHandler);

    connHandler.notifyPlayerOne = function (data) {
    }

    for(var i = 0; i < 80; i++) {
      gameManager.playerTwoMove('165 84', connHandler);
    }

    connHandler.notifyPlayerOne = function (data) {
      assert.strictEqual(data, '165 84 9671406556917033397649408');
    }

    gameManager.playerTwoMove('165 84', connHandler);

    connHandler.notifyPlayerTwo = function (data) {
      assert.strictEqual(data, '84');
    }

    // Test cost calculation
    gameManager.playerOneMove('84', connHandler);

    assert.strictEqual(gameManager.gameData.playerBill, '9671406556917033397649410');
  });
});
