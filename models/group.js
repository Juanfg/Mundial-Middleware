'use strict';
module.exports = (sequelize, DataTypes) => {
  var Group = sequelize.define('Group', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    tableName: 'Groups'
  });
  Group.associate = function(models) {
    // associations can be defined here
  };
  return Group;
};