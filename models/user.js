const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment = require('moment');

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
    User.hasMany(models.Bet, {
      foreignKey: 'user_id',
      as: 'bets'
    });
  };

  User.prototype.generateToken = function() {
    let expires = moment()
      .utc()
      .add({ days: 7 })
      .unix();
    
    let token = jwt.encode(
      {
        exp: expires,
        email: this.email
      }, 
      process.env.JWT_SECRET
    );

    return {
      token: token,
      expires: moment.unix(expires).format(),
      user: this.id
    };
  };

  User.prototype.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      if (err) {
        return callback(err);
      }

      callback(null, isMatch);
    });
  }

  return User;
};