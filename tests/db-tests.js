var assert = require('assert');
module.exports = function () {
  describe('DB Tests', function () {
    var DB = require('../src/db');
    var db = new DB();
    it('should have correct teams inserted', function (done) {
        this.timeout(1000);
        db.insertTeam('jeopardy');
        db.insertTeam('null');
        db.insertTeam('442');
        db.insertTeam('42');
        db.insertTeam('zorro');
        db.insertTeam('zorro');

        function callback(rows) {
          var teams = [];
          for(var i = 0; i < rows.length; i++) {
            teams.push(rows[i].name);
          }

          var teamsComp = ['jeopardy', 'null', '442', '42', 'zorro'];
          assert.deepEqual(teams, teamsComp);
          done();
        }

        db.getTeams(callback);
    });

    it('should insert matches properly', function (done) {
        db.insertMatch('jeopardy', 'null');
        db.insertMatch('jeopardy', '442');
        db.insertMatch('42', '442');

        db.getMatches(function (rows) {
          var matches = [];
          for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            matches.push([row.player_id, row.adversary_id, row.score]);
          }
          assert.deepEqual(matches, [ [ 1, 2, 0 ], [ 1, 3, 0 ], [ 4, 3, -1 ] ]);
          done();
        });
    })

    it('should finalize matches properly', function (done) {
        db.finalizeMatch('jeopardy', 'null', 3);
        db.finalizeMatch('jeopardy', '442', 2);
        db.finalizeMatch('42', '442', 4);
        db.getMatches(function (rows) {
          var matches = [];
          for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            matches.push([row.player_id, row.adversary_id, row.score]);
          }
          assert.deepEqual(matches, [ [ 1, 2, 3 ], [ 1, 3, 2 ], [ 4, 3, 4 ] ]);
          done();
        });
    })

    it('should have working current match', function (done) {
        db.getCurrentMatch(function (playerName, adversaryName) {
          assert.equal(playerName, null);
          assert.equal(adversaryName, null);
        });

        db.insertMatch('null', 'zorro');

        db.getCurrentMatch(function (player, adversary) {
          assert.equal(player.name, 'null');
          assert.equal(adversary.name, 'zorro');
          done();
        });
    });

    it('should have increment team score', function () {
        db.finalizeMatch('null', 'zorro');
        db.incrementTeamScore('null');

        var team = db.getTeam('null');
        assert.equal(team.score, 1);
    });
  });
}
