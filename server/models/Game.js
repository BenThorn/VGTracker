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

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
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

GameSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return GameModel.find(search).select('name year gameId platform category').exec(callback);
};

GameSchema.statics.deleteByName = (ownerId, gameId, callback) => {
  const gameToRemove = {
    owner: ownerId,
    gameId,
  };

  return GameModel.deleteOne(gameToRemove).exec(callback);
};

GameModel = mongoose.model('Game', GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;
