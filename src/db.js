module.exports = DB;
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

function DB(filename) {
  var file = filename;
  var exists = fs.existsSync(filename);
  var db = new sqlite3.Database(file);
  this.db = db;

  db.serialize(function () {
    if (!exists) {
      db.run('CREATE TABLE teams (id int NOT NULL, name varchar(255) NOT NULL, score int DEFAULT 0. PRIMARY_KEY (id))');
      db.run('CREATE TABLE matches (id int NOT NULL, player_id int NOT NULL, adversary_id int NOT NULL, score int DEFAULT -1, PRIMARY_KEY(id))');
    }
  })
}


DB.prototype.insertMatch = function(playerName, adversaryName, score) {
  var db = this.db;
  db.serialize(function () {
    db.get('SELECT FROM teams WHERE name = ?', playerName, function (err, row) {
      var playerRow = row;

      db.get('SELECT FROM teams WHERE name = ?', adversaryName, function (err, row) {
        var adversaryRow = row;

        db.run('INSERT OR IGNORE INTO matches (player_id, adversary_id, score) VALUES(?, ?, ?)', [playerRow.id, adversaryRow.id, score]);
      });
    });

  })
}

DB.prototype.incrementTeamScore = function(teamName, score) {
  var db = this.db;
  db.run('UPDATE teams SET score = score + 1 WHERE name = ?', teamName);
}
