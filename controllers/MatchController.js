const Sequelize = require('sequelize');
const winston = require('winston');

module.exports = function(app) {
    let Match = app.models.schema.Match;
    let User = app.models.schema.User;
    let Bet = app.models.schema.Bet;

    let MatchController = {
        index: function(req, res) {
            Match.findAll({})
            .then(function(matches) {
                winston.log('Success at getting all the matches in the DB');
                res.status(200).json(matches);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        create: async function(req, res) {
            Match.create({
                team_a: req.body.team_a || null,
                team_b: req.body.team_b || null,
                team_a_score: parseInt(req.body.team_a_score) || 0,
                team_b_score: parseInt(req.body.team_b_score) || 0,
                date: req.body.date || Date.now()
            })
            .then(async newMatch => {
                winston.log('Created a new match');
                await User.findAll({})
                    .then(async users => {
                        for (let i = 0; i < users.length; i++) {
                            await Bet.create({
                                user_id: users[i].id,
                                match_id: newMatch.id
                            })
                        }
                        res.status(200).json(newMatch);
                    })
                    .catch(err => {
                        res.json(err);
                    })
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        view: function(req, res) {
            let matchId = req.params.matchId;
            Match.findById(req.params.matchId, { include: [{ all: true }] })
                .then(match => {
                    if (!match) {
                        return res.status(404).json({
                            message: 'Match Not Found'
                        });
                    }

                    res.status(200).json(match);
                })
                .catch(err => {
                    res.json(err);
                })
        },

        update: function(req, res) {
            Match.findById(req.params.matchId, {})
                .then(match => {
                    if (!match) {
                        return res.status(404).json({
                            message: 'Match Not Found'
                        });
                    }

                    match
                        .update({
                            team_a: req.body.team_a || match.team_a,
                            team_b: req.body.team_b || match.team_b,
                            team_a_score: parseInt(req.body.team_a_score) || match.team_a_score,
                            team_b_score: parseInt(req.body.team_b_score) || match.team_b_score,
                            date: req.body.date || match.date
                        })
                        .then(() => res.status(200).json(match))
                        .catch(err => {
                            res.status(400).json(err);
                        })
                })
                .catch(err => {
                    res.json(err);
                })
        },

        delete: function(req, res) {
            Match.findById(req.params.matchId)
                .then(match => {
                    if (!match) {
                        return res.status(400).json({
                            message: 'Match Not Found'
                        });
                    }

                    return match
                        .destroy()
                        .then(() => res.status(200).json({
                            message: 'Deleted'
                        }))
                        .catch(err => {
                            res.status(400).json(err);
                        })
                })
                .catch(err => {
                    res.json(err);
                })
        },

        deactivate: function(req, res) {
            Match.findById(req.params.matchId)
                .then(match => {
                    if (!match) {
                        return res.status(400).json({
                            message: 'Match Not Found'
                        });
                    }

                    return match
                        .update({
                            active: false
                        })
                        .then(() => res.status(200).json({
                            message: 'Match is unactive now'
                        }))
                        .catch(err => {
                            res.status(400).json(err);
                        })
                })
                .catch(err => {
                    res.json(err);
                })
        },

        activate: function(req, res) {
            Match.findById(req.params.matchId)
                .then(match => {
                    if (!match) {
                        return res.status(400).json({
                            message: 'Match Not Found'
                        });
                    }

                    return match
                        .update({
                            active: true
                        })
                        .then(() => res.status(200).json({
                            message: 'Match is active now'
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

    return MatchController;
};