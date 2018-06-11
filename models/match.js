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
    // associations can be defined here
  };
  return Match;
};