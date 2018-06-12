const passport = require('passport');

module.exports = function(app) {
    let userCtrl = app.controllers.UserController;
    let teamCtrl = app.controllers.TeamController;
    let matchCtrl = app.controllers.MatchController;
    let groupCtrl = app.controllers.GroupController;
    let betCtrl = app.controllers.BetController;

    // Users routes
    app.route('/api/users')
        .get(userCtrl.index);
    app.route('/api/users/:userId')
        .get(userCtrl.view)
        .put(userCtrl.update)
        .delete(userCtrl.delete);
    
    // Authentication routes
    app.route('/api/auth/login')
        .post(userCtrl.login)
    app.route('/api/auth/register')
        .post(userCtrl.register);

    // Teams routes
    app.route('/api/teams')
        .get(teamCtrl.index)
        .post(teamCtrl.create);
    app.route('/api/teams/:teamId')
        .get(teamCtrl.view)
        .put(teamCtrl.update)
        .delete(teamCtrl.delete);

    // Matches routes
    app.route('/api/matches')
        .get(passport.authenticate('jwt', { session:false }), matchCtrl.index)
        .post(passport.authenticate('jwt', { session:false }), matchCtrl.create);
    app.route('/api/matches/:matchId')
        .get(passport.authenticate('jwt', { session:false }), matchCtrl.view)
        .put(passport.authenticate('jwt', { session:false }), matchCtrl.update)
        .delete(passport.authenticate('jwt', { session:false }), matchCtrl.delete);
    app.route('/api/matches/activate/:matchId')
        .put(passport.authenticate('jwt', { session: false }), matchCtrl.activate);
    app.route('/api/matches/deactivate/:matchId')
        .put(passport.authenticate('jwt', { session: false }), matchCtrl.deactivate);

    // Groups routes
    app.route('/api/groups')
        .get(groupCtrl.index)
        .post(groupCtrl.create);
    app.route('/api/groups/:groupId')
        .get(groupCtrl.view)
        .put(groupCtrl.update)
        .delete(groupCtrl.delete);

    // Bets routes
    app.route('/api/bets')
        .get(passport.authenticate('jwt', { session:false }), betCtrl.index)
        .post(passport.authenticate('jwt', { session:false }), betCtrl.create);
    app.route('/api/bets/:betId')
        .get(passport.authenticate('jwt', { session:false }), betCtrl.view)
        .put(passport.authenticate('jwt', { session:false }), betCtrl.update)
        .delete(passport.authenticate('jwt', { session:false }), betCtrl.delete);
    app.route('/api/bets/user/:userId')
        .get(passport.authenticate('jwt', { session: false }), betCtrl.viewByUser);

    app.route('/api/admin/calculateResults')
        .post(passport.authenticate('jwt', { session: false }), betCtrl.calculate);

    app.get('*', function(req, res) {
        res.json({ message: 'Tanda Mundial Backend' });
    });
};