const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('./models/user');

module.exports = function(app) {

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: process.env.JWT_SECRET
    }, async (payload, done) => {
        try {
            let User = app.models.schema.User;
            console.log(payload.email);
            User.find({ where: { email: payload.email } })
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: 'The user in the token was not found' });
                    }

                    return done(null, JSON.stringify(user));
                })
                .catch((err) => {
                    done(err, false);
                });

        } catch(err) {
            done(err, false);
        }
    }));

};