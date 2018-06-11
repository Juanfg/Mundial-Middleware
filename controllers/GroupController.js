const Sequelize = require('sequelize');
const winston = require('winston');

module.exports = function(app) {
    let Group = app.models.schema.Group;

    let GroupController = {
        index: function(req, res) {
            Group.findAll({})
            .then(function(groups) {
                winston.log('Success at getting all the groups in the DB');
                res.status(200).json(groups);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        create: function(req, res) {
            Group.create({
                name: req.body.name || null
            })
            .then(newGroup => {
                winston.log('Created a new group');
                res.status(200).json(newGroup);
            })
            .catch(err => {
                winston.error(err);
                res.json(err);
            });
        },

        view: function(req, res) {
            let groupId = req.params.groupId;
            Group.findById(req.params.groupId,{})
                .then(group => {
                    if (!group) {
                        return res.status(404).json({
                            message: 'Group Not Found'
                        });
                    }

                    res.status(200).json(group);
                })
                .catch(err => {
                    res.json(err);
                })
        },

        update: function(req, res) {
            Group.findById(req.params.groupId, {})
                .then(group => {
                    if (!group) {
                        return res.status(404).json({
                            message: 'Group Not Found'
                        });
                    }

                    group
                        .update({
                            name: req.body.name || group.name
                        })
                        .then(() => res.status(200).json(group))
                        .catch(err => {
                            res.status(400).json(err);
                        })
                })
                .catch(err => {
                    res.json(err);
                })
        },

        delete: function(req, res) {
            Group.findById(req.params.groupId)
                .then(group => {
                    if (!group) {
                        return res.status(400).json({
                            message: 'Group Not Found'
                        });
                    }

                    return group
                        .update({
                            active: false
                        })
                        .then(() => res.status(200).json({
                            message: 'Group is unactive now'
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

    return GroupController;
};