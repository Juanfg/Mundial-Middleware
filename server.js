const express = require('express');
const load = require('express-load');
const cors = require('cors');
const dotenv = require('dotenv').config({ path: '.env' });
const bodyParser = require('body-parser');
const passport = require('passport');

const port = process.env.PORT || 8081;
const app = express();

const passportInstance = require('./passport');

app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());

load('models/schema.js')
.then('controllers')
.then('routes.js')
.into(app);

var sequelize = app.models.schema.sequelize;


sequelize.sync().done(function () {
    app.listen(port, function () {
        console.log("Listening on port %s", port);
    })
});

const passportService = new passportInstance(app);

module.exports = app;