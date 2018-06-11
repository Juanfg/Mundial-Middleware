const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment = require('moment');

function encryptPasswordIfChanged(user, options) {
  user.set('password', bcrypt.hashSync(user.password, 10));
}

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

  User.beforeCreate(encryptPasswordIfChanged);
  User.beforeUpdate(encryptPasswordIfChanged);

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