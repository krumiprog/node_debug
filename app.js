var express = require('express');
var app = express();
var db = require('./db');
var user = require('./controllers/usercontroller');
var game = require('./controllers/gamecontroller');

const PORT = 4000;

db.sync();
app.use(require('body-parser').urlencoded({ extended: true }));
app.use('/api/auth', user);
app.use(require('./middleware/validate-session'));
app.use('/api/game', game);
app.listen(PORT, function () {
  console.log(`App is listening on ${PORT}`);
});
