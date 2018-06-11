'use strict';
module.exports = (sequelize, DataTypes) => {
  var Group_Team = sequelize.define('Group_Team', {
    group_id: DataTypes.INTEGER,
    team_id: DataTypes.INTEGER
  }, {
    tableName: 'Group_Teams'
  });
  Group_Team.associate = function(models) {
    // associations can be defined here
  };
  return Group_Team;
};