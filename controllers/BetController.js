const Sequelize = require('sequelize');
const winston = require('winston');

module.exports = function(app) {
    let Bet = app.models.schema.Bet;
    let Match = app.models.schema.Match;
    let User = app.models.schema.User;

    let BetController = {
        index: function(req, res) {
            Bet.findAll({ include: [{ all: true }] })
            .then(function(betss) {
                winston.log('Success at getting all the betss in the DB');
                res.status(200).json(betss);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        viewByUser: function(req, res) {
            Bet.findAll({ where: { user_id: req.params.userId }, include: [{ all: true }], 
                order: [
                    [ { model: Match, as: 'match' }, 'date', 'DESC' ]
                ]
            })
            .then(function(betss) {
                winston.log('Success at getting all the betss in the DB');
                res.status(200).json(betss);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        create: function(req, res) {
            Bet.create({
                user_id: req.body.user_id || null,
                match_id: req.body.match_id || null,
                team_a_score: parseInt(req.body.team_a_score) || 0,
                team_b_score: parseInt(req.body.team_b_score) || 0
            })
            .then(newBet => {
                winston.log('Created a new bets');
                res.status(200).json(newBet);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        view: function(req, res) {
            let betsId = req.params.betId;
            Bet.findById(req.params.betId,{})
                .then(bets => {
                    if (!bets) {
                        return res.status(404).json({
                            message: 'Bet Not Found'
                        });
                    }

                    res.status(200).json(bets);
                })
                .catch(err => {
                    res.json(err);
                })
        },

        update: function(req, res) {
            Bet.findById(req.params.betId, {})
                .then(bet => {
                    if (!bet) {
                        return res.status(404).json({
                            message: 'Bet Not Found'
                        });
                    }

                    bet
                        .update({
                            user_id: req.body.user_id || bet.user_id,
                            match_id: req.body.match_id || bet.match_id,
                            team_a_score: parseInt(req.body.team_a_score) || bet.team_a_score,
                            team_b_score: parseInt(req.body.team_b_score) || bet.team_b_score,
                            points: parseInt(req.body.points) || bet.points
                        })
                        .then(() => {
                            res.status(200).json(bet)
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
            Bet.findById(req.params.betId)
                .then(bets => {
                    if (!bets) {
                        return res.status(400).json({
                            message: 'Bet Not Found'
                        });
                    }

                    return bets
                        .update({
                            active: false
                        })
                        .then(() => res.status(200).json({
                            message: 'Bet is unactive now'
                        }))
                        .catch(err => {
                            res.status(400).json(err);
                        })
                })
                .catch(err => {
                    res.json(err);
                })
        },

        calculate: function(req, res) {
            User.findAll({ where: [{ active: true }], include: [{ all: true }] })
                .then(async users => {
                    for (let i = 0; i < users.length; i++) {
                        let points = 0;
                        let b = users[i].bets;
                        for (let j = 0; j < b.length; j++) {
                            await Bet.findById(b[j].id, { include: [{ all: true }] })
                                .then(async bet => {
                                    if (!bet.match.active) {
                                        if (bet.match.team_a_score == bet.team_a_score && bet.match.team_b_score == bet.team_b_score) {
                                            points += 3;
                                        }
                                        else {
                                            let a = bet.match.team_a_score - bet.match.team_b_score;
                                            let b = bet.team_a_score - bet.team_b_score;
                                            if (( a < 0 && b < 0 ) || ( a == 0 && b == 0 ) || (a > 0 && b > 0)) {
                                                points += 1;
                                            }
                                        }
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                        await users[i].update({
                            points: points
                        });
                    }
                    res.status(200).json({ message: "Points updated" })
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }

    return BetController;
};