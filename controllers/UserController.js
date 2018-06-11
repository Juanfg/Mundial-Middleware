const Sequelize = require('sequelize');
const winston = require('winston');

module.exports = function(app) {
    let User = app.models.schema.User;

    let UserController = {
        index: function(req, res) {
            User.findAll({})
            .then(function(users) {
                winston.log('Success at getting all the users in the DB');
                res.status(200).json(users);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        create: function(req, res) {
            User.create({
                name: req.body.name || null,
                email: req.body.email || null,
                password: req.body.password || 'secret',
                photo_path: req.body.photo_path || null,
            })
            .then(newUser => {
                winston.log('Created a new user');
                res.status(200).json(newUser);
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

        update: function(req, res) {
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
                            password: req.body.password || user.password,
                            photo_path: req.body.photo_path || user.photo_path,
                            points: parseInt(req.body.points) || user.points
                        })
                        .then(() => res.status(200).json(user))
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