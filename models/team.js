'use strict';
module.exports = (sequelize, DataTypes) => {
  var Team = sequelize.define('Team', {
    name: DataTypes.STRING,
    photo_path: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    tableName: 'Teams'
  });
  Team.associate = function(models) {
    // associations can be defined here
  };
  return Team;
};