const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();
const Game = require('../db').import('../models/game.model');

router.get('/all', (req, res) => {
  Game.findAll({ where: { owner_id: req.user.id } })
    .then(games =>
      res.status(StatusCodes.OK).json({
        games,
        message: 'Data fetched.',
      })
    )
    .catch(err =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Data not found',
      })
    );
});

router.get('/:id', (req, res) => {
  Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } })
    .then(game =>
      res.status(StatusCodes.OK).json({
        game,
      })
    )
    .catch(err =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Data not found.',
      })
    );
});

router.post('/create', (req, res) => {
  const { title, studio, esrb_rating, user_rating, have_played } =
    req.body.game;
  const owner_id = req.body.user.id;

  Game.create({
    title,
    owner_id,
    studio,
    esrb_rating,
    user_rating,
    have_played,
  })
    .then(game =>
      res.status(StatusCodes.OK).json({
        game,
        message: 'Game created.',
      })
    )
    .catch(err =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
    );
});

router.put('/update/:id', (req, res) => {
  const { title, studio, esrb_rating, user_rating, have_played } =
    req.body.game;

  Game.update(
    {
      title,
      studio,
      esrb_rating,
      user_rating,
      have_played,
    },
    {
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    }
  )
    .then(game =>
      res.status(StatusCodes.OK).json({
        game,
        message: 'Successfully updated.',
      })
    )
    .catch(err =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message,
      })
    );
});

router.delete('/remove/:id', (req, res) => {
  Game.destroy({
    where: {
      id: req.params.id,
      owner_id: req.user.id,
    },
  })
    .then(game =>
      res.status(StatusCodes.OK).json({
        game,
        message: 'Successfully deleted',
      })
    )
    .catch(err =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message,
      })
    );
});

module.exports = router;
