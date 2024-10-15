const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serverSchema = mongoose.model('server_config', new Schema({
  _id: String,
  data: {
    logs: {
        events: { type: Array, default: null },
        logChannel: { type: String, default: null },
        ignoredChannels: { type: Array, default: null }
    },
    joinMessages: { type: Array, default: [] },
    usedBanners: { type: Array, default: [] },
    topics: { type: Array, default: [] },
    wyrs: { type: Array, default: [] },
    ignoredTopics: { type: Array, default: [] },
    ignoredKorraTopics: { type: Array, default: [] },
    ignoredATLATopics: { type: Array, default: [] },
    ignoredWyrs: { type: Array, default: [] },
    topicTimestamps: { 
      normal: { type: Number, default: null },
      atla: { type: Number, default: null },
      korra: { type: Number, default: null },
    },
  }
}, {
    autoIndex: true,
    minimize: false,
}));

module.exports = serverSchema;