const Sequelize = require('sequelize');
const winston = require('winston');

module.exports = function(app) {
    let Team = app.models.schema.Team;

    let TeamController = {
        index: function(req, res) {
            Team.findAll({})
            .then(function(teams) {
                winston.log('Success at getting all the teams in the DB');
                res.status(200).json(teams);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        create: function(req, res) {
            Team.create({
                name: req.body.name || null,
                photo_path: req.body.photo_path || null
            })
            .then(newTeam => {
                winston.log('Created a new team');
                res.status(200).json(newTeam);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        view: function(req, res) {
            let teamId = req.params.teamId;
            Team.findById(req.params.teamId,{})
                .then(team => {
                    if (!team) {
                        return res.status(404).json({
                            message: 'Team Not Found'
                        });
                    }

                    res.status(200).json(team);
                })
                .catch(err => {
                    res.json(err);
                })
        },

        update: function(req, res) {
            Team.findById(req.params.teamId, {})
                .then(team => {
                    if (!team) {
                        return res.status(404).json({
                            message: 'Team Not Found'
                        });
                    }

                    team
                        .update({
                            name: req.body.name || team.name,
                            photo_path: req.body.photo_path || team.photo_path
                        })
                        .then(() => res.status(200).json(team))
                        .catch(err => {
                            res.status(400).json(err);
                        })
                })
                .catch(err => {
                    res.json(err);
                })
        },

        delete: function(req, res) {
            Team.findById(req.params.teamId)
                .then(team => {
                    if (!team) {
                        return res.status(400).json({
                            message: 'Team Not Found'
                        });
                    }

                    return team
                        .update({
                            active: false
                        })
                        .then(() => res.status(200).json({
                            message: 'Team is unactive now'
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

    return TeamController;
};