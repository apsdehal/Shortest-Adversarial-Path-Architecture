module.exports = DB;
var fs = require('fs');
var sqlite = require('sqlite-sync');

function DB(filename) {
  var file = filename;

  var exists;
  if (file) {
   exists = fs.existsSync(filename);
 }

  if (!file) {
    exists = false;
    sqlite.connect();
  } else {
    sqlite.connect(file);
  }

  this.db = sqlite;

  if (!exists) {
    this.db.run('CREATE TABLE teams (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(255) NOT NULL, score INTEGER DEFAULT 0)');
    this.db.run('CREATE TABLE matches (id INTEGER PRIMARY KEY AUTOINCREMENT, player_id INTEGER NOT NULL, adversary_id INTEGER NOT NULL, score INTEGER DEFAULT 0)');
  }
}


DB.prototype.insertMatch = function(playerName, adversaryName) {
  var db = this.db;
  var playerRow = db.run('SELECT * FROM teams WHERE name = ?', [playerName])

  var adversaryRow = db.run('SELECT * FROM teams WHERE name = ?', [adversaryName]);

  db.run('UPDATE matches SET score = 0 WHERE score = -1');
  db.run('INSERT OR IGNORE INTO matches (player_id, adversary_id, score) VALUES(?, ?, ?)', [playerRow[0].id, adversaryRow[0].id, -1]);

}

DB.prototype.finalizeMatch = function(playerName, adversaryName, score) {
  var db = this.db;
  var playerRow = db.run('SELECT * FROM teams WHERE name = ?', [playerName])[0];

  var adversaryRow =  db.run('SELECT * FROM teams WHERE name = ?', [adversaryName])[0];
  db.run('UPDATE matches SET score = ? WHERE player_id = ? AND adversary_id = ?', [score, playerRow.id, adversaryRow.id]);
}

DB.prototype.insertTeam = function (team) {
  var db = this.db;
  var rows = db.run('SELECT * FROM teams WHERE name = ?', [team]);
  if (rows.length == 0) {
    db.run('INSERT INTO teams (name) VALUES (?)', [team]);
  }
}

DB.prototype.getTeam = function (team) {
  var teamRow = this.db.run('SELECT * FROM teams WHERE name = ?', [team])[0];
  return teamRow;
}

DB.prototype.incrementTeamScore = function(teamName, score) {
  var db = this.db;
  db.run('UPDATE teams SET score = score + 1 WHERE name = ?', [teamName]);
}

DB.prototype.getTeams = function (callback) {
  var db = this.db;
  var rows = db.run('SELECT * FROM teams');
  callback(rows)
}

DB.prototype.getCurrentMatch = function (callback) {
  var db = this.db;
  var match = db.run('SELECT * FROM matches WHERE score = -1');

  if (match.length === 0) {
    callback(null, null);
    return;
  }

  var player = db.run('SELECT * FROM teams where id = ?', [match[0].player_id]);
  var adversary = db.run('SELECT * FROM teams where id = ?', [match[0].adversary_id]);
  callback(player[0], adversary[0]);
}

DB.prototype.getMatches = function (callback) {
  var db = this.db;
  callback(db.run('SELECT * FROM matches'));
}
