'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    photo_path: DataTypes.STRING,
    points: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    tableName: 'Users'
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};