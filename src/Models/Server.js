const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serverSchema = mongoose.model('server_config', new Schema({
  _id: String,
  data: {
    logs: {
        events: { type: Array, default: null },
        logChannel: { type: String, default: null },
        ignoredChannels: { type: Array, default: null }
    }
  }
}, {
    autoIndex: true,
    minimize: false,
}));

module.exports = serverSchema;