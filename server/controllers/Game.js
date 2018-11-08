const models = require('../models');

const Game = models.Game;

const addPage = (req, res) => {
  Game.GameModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), games: docs });
  });
};

const addGame = (req, res) => {
  if (!req.body.name || !req.body.year) {
    return res.status(400).json({ error: 'Name, year required' });
  }

  const gameData = {
    name: req.body.name,
    year: req.body.year,
    owner: req.session.account._id,
  };

  const newGame = new Game.GameModel(gameData);

  const gamePromise = newGame.save();

  gamePromise.then(() => res.json({ redirect: '/addPage' }));

  gamePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Game already exists in collection' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return gamePromise;
};

const getGames = (request, response) => {
  const req = request;
  const res = response;

  return Game.GameModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ games: docs });
  });
};

// const removeDomo = (request, response) => {
//   const req = request;
//   const res = response;

//   return Domo.DomoModel.deleteByName(req.session.account._id, req.body.name, (err) => {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ error: 'An error occurred' });
//     }
//     return res.json({ message: 'Removed domo' });
//   });
// };

module.exports.addPage = addPage;
module.exports.getGames = getGames;
// module.exports.removeDomo = removeDomo;
module.exports.add = addGame;
