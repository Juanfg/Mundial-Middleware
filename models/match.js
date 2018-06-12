'use strict';
module.exports = (sequelize, DataTypes) => {
  var Match = sequelize.define('Match', {
    team_a: DataTypes.INTEGER,
    team_b: DataTypes.INTEGER,
    team_a_score: DataTypes.INTEGER,
    team_b_score: DataTypes.INTEGER,
    date: DataTypes.DATE,
    active: DataTypes.BOOLEAN
  }, {
    tableName: 'Matches'
  });
  Match.associate = function(models) {
    Match.hasMany(models.Bet, {
      foreignKey: 'match_id',
      as: 'bets'
    });
    Match.belongsTo(models.Team, {
      foreignKey: 'team_a',
      as: 'teamA'
    });
    Match.belongsTo(models.Team, {
      foreignKey: 'team_b',
      as: 'teamB'
    });
  };
  return Match;
};