module.exports = function(app) {
    let userCtrl = app.controllers.UserController;
    let teamCtrl = app.controllers.TeamController;
    let matchCtrl = app.controllers.MatchController;
    let groupCtrl = app.controllers.GroupController;
    let betCtrl = app.controllers.BetController;

    // Users routes
    app.get('/api/users', userCtrl.index);
    app.post('/api/users', userCtrl.create);
    app.get('/api/users/:userId', userCtrl.view);
    app.put('/api/users/:userId', userCtrl.update);
    app.delete('/api/users/:userId', userCtrl.delete);

    // Teams routes
    app.get('/api/teams', teamCtrl.index);
    app.post('/api/teams', teamCtrl.create);
    app.get('/api/teams/:teamId', teamCtrl.view);
    app.put('/api/teams/:teamId', teamCtrl.update);
    app.delete('/api/teams/:teamId', teamCtrl.delete);

    // Matches routes
    app.get('/api/matches', matchCtrl.index);
    app.post('/api/matches', matchCtrl.create);
    app.get('/api/matches/:matchId', matchCtrl.view);
    app.put('/api/matches/:matchId', matchCtrl.update);
    app.delete('/api/matches/:matchId', matchCtrl.delete);

    // Groups routes
    app.get('/api/groups', groupCtrl.index);
    app.post('/api/groups', groupCtrl.create);
    app.get('/api/groups/:groupId', groupCtrl.view);
    app.put('/api/groups/:groupId', groupCtrl.update);
    app.delete('/api/groups/:groupId', groupCtrl.delete);

    // Bets routes
    app.get('/api/bets', betCtrl.index);
    app.post('/api/bets', betCtrl.create);
    app.get('/api/bets/:betId', betCtrl.view);
    app.put('/api/bets/:betId', betCtrl.update);
    app.delete('/api/bets/:betId', betCtrl.delete);

    app.get('*', function(req, res) {
        res.json({ message: 'Tanda Mundial Backend' });
    });
};