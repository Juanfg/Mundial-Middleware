const Sequelize = require('sequelize');
const winston = require('winston');
const bcrypt = require('bcryptjs');

module.exports = function(app) {
    let User = app.models.schema.User;
    let Match = app.models.schema.Match;
    let Bet = app.models.schema.Bet;

    let UserController = {
        index: function(req, res) {
            User.findAll({
                order: [ [Sequelize.col('points'), 'DESC'] ],
                where: [{ active: true }],
                include: [{ all: true }]
            })
            .then(function(users) {
                winston.log('Success at getting all the users in the DB');
                res.status(200).json(users);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        register: function(req, res) {
            User.create({
                name: req.body.name || null,
                email: req.body.email || null,
                password: bcrypt.hashSync(req.body.password, 10) || bcrypt.hashSync('secret', 10),
                photo_path: req.body.photo_path || null,
            })
            .then(async newUser => {
                winston.log('Created a new user');
                await Match.findAll({})
                    .then(async matches => {
                        for(let i = 0; i < matches.length; i++) {
                            await Bet.create({
                                user_id: newUser.id,
                                match_id: matches[i].id
                            })
                        }
                        res.status(200).json({
                            data: newUser,
                            token: newUser.generateToken()
                        });
                    })
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        login: function(req, res) {
            User.find({
                where: { email: req.body.email }
            })
            .then(user => {
                if (!user) {
                    return res.status(400).json({
                        message: `User doesn't exist`
                    });
                }

                if (!user.active) {
                    return res.status(400).json({
                        message: `Usuario no activo`
                    });
                }

                user.verifyPassword(req.body.password, function(err, isMatch) {
                    if (err) {
                        return res.status(500).json({
                            message: `Errory trying to verify password ${err}`
                        });
                    }

                    if (!isMatch) {
                        return res.status(400).json({
                            message: `Invalid credentials, password doesn't match`
                        });
                    }

                    return res.status(200).json({
                        message: 'OK',
                        data: user,
                        token: user.generateToken()
                    });
                });
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        view: function(req, res) {
            let userId = req.params.userId;
            User.findById(req.params.userId,{})
                .then(user => {
                    if (!user) {
                        return res.status(404).json({
                            message: 'User Not Found'
                        });
                    }

                    res.status(200).json(user);
                })
                .catch(err => {
                    res.json(err);
                })
        },

        update: async function(req, res) {
            let newPassword = null
            if (req.body.password) {
                 newPassword = await bcrypt.hashSync(req.body.password, 10);
            }
            User.findById(req.params.userId, {})
                .then(user => {
                    if (!user) {
                        return res.status(404).json({
                            message: 'User Not Found'
                        });
                    }

                    user
                        .update({
                            name: req.body.name || user.name,
                            email: req.body.email || user.email,
                            password: newPassword || user.password,
                            photo_path: req.body.photo_path || user.photo_path,
                            points: parseInt(req.body.points) || user.points
                        })
                        .then(() => {
                            res.status(200).json(user) 
                        })
                        .catch(err => {
                            res.status(400).json(err);
                        })
                })
                .catch(err => {
                    res.json(err);
                })
        },

        delete: function(req, res) {
            User.findById(req.params.userId)
                .then(user => {
                    if (!user) {
                        return res.status(400).json({
                            message: 'User Not Found'
                        });
                    }

                    return user
                        .update({
                            active: false
                        })
                        .then(() => res.status(200).json({
                            message: 'User is unactive now'
                        }))
                        .catch(err => {
                            res.status(400).json(err);
                        })
                })
                .catch(err => {
                    res.json(err);
                })
        }

    }

    return UserController;
};