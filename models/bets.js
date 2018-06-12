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
    Bet.belongsTo(models.Match, {
      foreignKey: 'match_id',
      as: 'match'
    });

    Bet.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };
  return Bet;
};