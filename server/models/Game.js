const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let GameModel = {};

const convertId = mongoose.Types.ObjectId;
const trimStr = (str) => _.escape(str).trim();

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: trimStr,
  },

  year: {
    type: Number,
    min: 0,
    required: false,
  },

  gameId: {
    type: Number,
    required: true,
  },

  platform: {
    type: String,
    required: true,
    trim: true,
    set: trimStr,
  },

  category: {
    type: String,
    required: true,
    trim: true,
    set: trimStr,
  },

  picUrl: {
    type: String,
    required: true,
    trim: true,
    set: trimStr,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  lastPlayed: {
    type: Date,
    required: false,
    default: null,
  },

  playTime: {
    type: Number,
    required: false,
    default: null,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

GameSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  year: doc.year,
});

// Gets all the data for all of a user's games
GameSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  const selection = 'name year gameId platform category lastPlayed picUrl playTime';
  return GameModel.find(search).select(selection).exec(callback);
};

// Deletes a single of a user's games based on the ID
GameSchema.statics.deleteByName = (ownerId, gameId, callback) => {
  const gameToRemove = {
    owner: ownerId,
    gameId,
  };

  return GameModel.deleteOne(gameToRemove).exec(callback);
};

// Updates a game with the specified parameters
GameSchema.statics.updateByName = (ownerId, gameId, params, callback) => {
  const gameToUpdate = {
    owner: ownerId,
    gameId,
  };

  const updateParams = {
    $set: {
      category: params.category,
    },
  };

  if (params.lastPlayed) {
    updateParams.$set.lastPlayed = params.lastPlayed;
  }

  if (params.playTime) {
    updateParams.$set.playTime = params.playTime;
  }

  return GameModel.updateOne(gameToUpdate, updateParams, callback);
};

GameModel = mongoose.model('Game', GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;
