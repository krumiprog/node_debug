const express = require('express');
const app = express();
const db = require('./db');

const PORT = process.env.PORT || 4000;

db.sync();

app.use(require('body-parser').urlencoded({ extended: true }));
app.use('/api/auth', require('./controllers/user.controller'));
app.use(require('./middleware/validate-session'));
app.use('/api/game', require('./controllers/game.controller'));

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
