'use strict';
module.exports = (sequelize, DataTypes) => {
  var Bet = sequelize.define('Bet', {
    match_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    team_a_score: DataTypes.INTEGER,
    team_b_score: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    tableName: 'Bets'
  });
  Bet.associate = function(models) {
    // associations can be defined here
  };
  return Bet;
};