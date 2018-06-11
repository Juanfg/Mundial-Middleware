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
        .get(passport.authenticate('jwt', { session: false }), teamCtrl.index)
        .post(teamCtrl.create);
    app.route('/api/teams/:teamId')
        .get(teamCtrl.view)
        .put(teamCtrl.update)
        .delete(teamCtrl.delete);

    // Matches routes
    app.route('/api/matches')
        .get(matchCtrl.index)
        .post(matchCtrl.create);
    app.route('/api/matches/:matchId')
        .get(matchCtrl.view)
        .put(matchCtrl.update)
        .delete(matchCtrl.delete);

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
        .get(betCtrl.index)
        .post(betCtrl.create);
    app.route('/api/bets/:betId')
        .get(betCtrl.view)
        .put(betCtrl.update)
        .delete(betCtrl.delete);

    app.get('*', function(req, res) {
        res.json({ message: 'Tanda Mundial Backend' });
    });
};