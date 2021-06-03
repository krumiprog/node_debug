const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user.model');
const { SECRET_TOKEN } = require('../constants');

module.exports = (req, res, next) => {
  if (req.method == 'OPTIONS') {
    next();
  } else {
    const sessionToken = req.headers.authorization;

    if (!sessionToken)
      return res
        .status(StatusCodes.FORBIDDEN)
        .send({ auth: false, message: 'No token provided.' });
    else {
      jwt.verify(sessionToken, SECRET_TOKEN, (err, decoded) => {
        if (decoded) {
          User.findOne({ where: { id: decoded.id } })
            .then(user => {
              req.user = user;
              next();
            })
            .catch(err =>
              res
                .status(StatusCodes.UNAUTHORIZED)
                .send({ error: 'not authorized' })
            );
        } else {
          res.status(StatusCodes.BAD_REQUEST).send({ error: 'not authorized' });
        }
      });
    }
  }
};
