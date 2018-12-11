const models = require('../models');
const giantbomb = require('giantbomb');
const gb = giantbomb('a8c50336272d5cf222a55a2e86f8486011b9e0ee');

const Game = models.Game;

// Gets the user's games and renders them to the app page
const addPage = (req, res) => {
  Game.GameModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), games: docs });
  });
};

// Hooks up url to the default view
const defaultPage = (req, res) => res.render('default', { csrfToken: req.csrfToken() });

// Hooks up url to the list view
const listPage = (req, res) => res.render('list', { csrfToken: req.csrfToken() });

const logPage = (req, res) => res.render('log', { csrfToken: req.csrfToken() });

// Add game request to the database.
const addGame = (req, res) => {
  if (!req.body.name || !req.body.year) {
    return res.status(400).json({ error: 'Name, year required' });
  }

  const gameData = {
    name: req.body.name,
    year: req.body.year,
    gameId: req.body.gameId,
    platform: req.body.platform,
    category: req.body.category,
    owner: req.session.account._id,
    picUrl: req.body.picUrl,
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

// Database request to get all of a user's games
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

// Database request to remove a single game from a user's collection
const removeGame = (request, response) => {
  const req = request;
  const res = response;

  return Game.GameModel.deleteByName(req.session.account._id, req.body.gameId, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ message: 'Removed game' });
  });
};

// Database request to update a single game, checking for the existence of various params
const updateGame = (request, response) => {
  const req = request;
  const res = response;

  console.log(req.body);

  const params = {
    category: req.body.category,
  };

  if (req.body.lastPlayed !== '') {
    params.lastPlayed = req.body.lastPlayed;
  }

  if (req.body.playTime !== '') {
    params.playTime = req.body.playTime;
  }

  console.log(params);

  return Game.GameModel.updateByName(req.session.account._id, req.body.gameId, params, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ message: 'Updated game' });
  });
};

// Makes call to external API
const searchGames = (request, response) => {
  const req = request;
  const res = response;
  const parsedUrl = req._parsedUrl.query;
  const searchTerm = (parsedUrl);
  const config = {
    fields: ['name', 'original_release_date', 'expected_release_year', 'id', 'platforms', 'image'],
    sortBy: 'original_release_date',
    sortDir: 'desc',
    perPage: 20,
  };
  gb.games.search(searchTerm, config, (err, result, json) => {
    res.send(json.results);
  });
};

module.exports.addPage = addPage;
module.exports.getGames = getGames;
module.exports.removeGame = removeGame;
module.exports.searchGames = searchGames;
module.exports.defaultPage = defaultPage;
module.exports.updateGame = updateGame;
module.exports.listPage = listPage;
module.exports.logPage = logPage;
module.exports.add = addGame;
