const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user.model');
const { SECRET_TOKEN, TIME_EXPIRATION } = require('../constants');

router.post('/signup', (req, res) => {
  const { full_name, username, password, email } = req.body.user;
  const passwordHash = bcrypt.hashSync(password, 10);

  User.create({
    full_name,
    username,
    passwordHash,
    email,
  })
    .then(user => {
      const token = jwt.sign({ id: user.id }, SECRET_TOKEN, {
        expiresIn: TIME_EXPIRATION,
      });
      res.status(StatusCodes.OK).json({ user, token });
    })
    .catch(err =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
    );
});

router.post('/signin', (req, res) => {
  const { username, password } = req.body.user;

  User.findOne({ where: { username } }).then(user => {
    if (user) {
      bcrypt.compare(password, user.passwordHash, (err, matches) => {
        if (matches) {
          const token = jwt.sign({ id: user.id }, SECRET_TOKEN, {
            expiresIn: TIME_EXPIRATION,
          });
          res.json({
            user,
            message: 'Successfully authenticated.',
            sessionToken: token,
          });
        } else {
          res
            .status(StatusCodes.BAD_GATEWAY)
            .send({ error: 'Passwords do not match.' });
        }
      });
    } else {
      res.status(StatusCodes.FORBIDDEN).send({ error: 'User not found.' });
    }
  });
});

module.exports = router;
