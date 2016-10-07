module.exports = Timer;
const chalk = require('chalk');

function Timer() {
  this.playerOneTimer = 0;
  this.playerTwoTimer = 0;
  this.playerStartTime;
  this.playerTimeout;
  this.totalTimeAvailable = 120000;
}

Timer.prototype.startCounting = function(connHandler, num) {
  this.playerStartTime = Date.now();

  var timeAvailable =  this.totalTimeAvailable;
  if (num === 1) {
    timeAvailable -= this.playerOneTimer;
  } else if (num === 2){
    timeAvailable -= this.playerTwoTimer;
  } else {
    return;
  }

  this.playerTimeout = setTimeout(function () {
    connHandler.endGameTimeout(num);
  }, timeAvailable);
};

Timer.prototype.clearPlayerTimeout = function(num) {
  if (num === 1) {
    this.playerOneTimer += Date.now() - this.playerStartTime;
    console.log(chalk.cyan('Player has', (this.totalTimeAvailable - this.playerOneTimer) / 1000, 'seconds left'));
  } else if (num === 2) {
    this.playerTwoTimer += Date.now() - this.playerStartTime;
    console.log(chalk.yellow('Adversary has', (this.totalTimeAvailable - this.playerTwoTimer) / 1000, 'seconds left'));
  }

  this.clear();
}

Timer.prototype.clear = function() {
  clearTimeout(this.playerTimeout);
}
