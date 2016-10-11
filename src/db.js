module.exports = DB;
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

function DB(filename, inMemory) {
  var file = filename;
  var exists = fs.existsSync(filename);

  if (inMemory) {
    exists = false;
  }

  var db = new sqlite3.Database(file);
  this.db = db;

  db.serialize(function () {
    if (!exists) {
      db.run('CREATE TABLE teams (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(255) NOT NULL, score INTEGER DEFAULT 0)');
      db.run('CREATE TABLE matches (id INTEGER PRIMARY KEY AUTOINCREMENT, player_id INTEGER NOT NULL, adversary_id INTEGER NOT NULL, score INTEGER DEFAULT -1)');
    }
  })
}


DB.prototype.insertMatch = function(playerName, adversaryName) {
  var db = this.db;
  db.serialize(function () {
    db.get('SELECT * FROM teams WHERE name = [?]', playerName, function (err, row) {
      var playerRow = row;

      db.get('SELECT * FROM teams WHERE name = [?]', adversaryName, function (err, row) {
        var adversaryRow = row;

        db.run('INSERT OR IGNORE INTO matches (player_id, adversary_id, score) VALUES(?, ?, ?)', [playerRow.id, adversaryRow.id, -2]);
      });
    });

  })
}

DB.prototype.finalizeMatch = function(playerName, adversaryName, score) {
  var db = this.db;
  db.serialize(function () {
    db.get('SELECT * FROM teams WHERE name = [?]', playerName, function (err, row) {
      var playerRow = row;

      db.get('SELECT * FROM teams WHERE name = [?]', adversaryName, function (err, row) {
        var adversaryRow = row;

        db.run('UPDATE matches SET score = ? WHERE player_id = ? AND adversary_id = ?)', [score, playerRow.id, adversaryRow.id]);
      });
    });

  })
}

DB.prototype.insertTeam = function (team) {
  var db = this.db;
  db.serialize(function () {
    db.get('SELECT * FROM teams WHERE name = [?]', team, function (err, rows) {
      if (err) {
        return;
      }
      if (!rows) {
        db.run('INSERT INTO teams (name) VALUES (?)', team);
      }
    });
  });
}

DB.prototype.incrementTeamScore = function(teamName, score) {
  var db = this.db;
  db.run('UPDATE teams SET score = score + 1 WHERE name = [?]', teamName);
}

DB.prototype.getTeams = function (callback) {
  var db = this.db;
  db.all('SELECT * FROM teams', function (err, rows) {
    if (err) {
      return;
    }
    callback(rows)
  });
}

DB.prototype.getCurrentMatch = function (callback) {
  var db = this.db;
  db.serialize(function () {

    db.get('SELECT * FROM matches WHERE score = -2', function (err, row) {
      if (err) {
        return;
      }
      if (row) {
        db.get('SELECT * FROM teams where id = ?', row.player_id, function (err, player) {
            if (err) {
              return;
            } else {
              var playerTeam = player.name;
              db.get('SELECT * FROM teams where id = ?', row.adversary_id, function (err, adversary) {
                if (err) {
                  return;
                } else {
                  var adversaryName = adversary.name;
                  callback(playerName, adversaryName);
                }
              });
            }
        })
      }
    });
  });
}

DB.prototype.getMatches = function (callback) {
  var db = this.db;
  db.all('SELECT * FROM matches', function (err, rows) {
    if (err) {
      return;
    }
    callback(rows);
  });
}
