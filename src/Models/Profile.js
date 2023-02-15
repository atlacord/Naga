const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = mongoose.model('user_profiles', new Schema({
  _id: String,
  data: {
    global_xp: {type: Number, default: 0},
    global_level: {type: Number, default: 1},
    profile: {
      bio: {type: String, default: 'No bio written.'},
      background: {type: String, default: null},
      pattern: {type: String, default: null},
      emblem: {type: String, default: null},
      hat: {type: String, default: null},
      wreath: {type: String, default: null},
      color: {type: String, default: null},
      birthday: {type: String, default: null},
      inventory: {type: Array, default: []},
      gacks: {type: String, default: null }
    },
    economy: {
      bank: {type: Number, default: null},
      wallet: {type: Number, default: null},
      streak: {
        alltime: {type: Number, default: 0},
        current: {type: Number, default: 0},
        timestamp: {type: Number, default: 0}
      },
      title: { type: String, default: null},
      beg: { type: Date, default: 0 },
      shard: {type: Number, default: null}
    },
    tips: {
      given: {type: Number, default: 0},
      received: {type: Number, default: 0},
      timestamp: {type: Number, default: 0}
    },
    xp: {type: Array, default: []},
    level: {type: Number, default: 0},
    birthdayTimestamp: {type: Date, default: 0 },
  }
}, {
    autoIndex: true,
    minimize: false,
}));

module.exports = profileSchema;