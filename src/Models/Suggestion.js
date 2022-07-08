const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suggestionSchema = mongoose.model('suggestions', new Schema({
  _id: String,
  data: {
    author: { type: String, default: 0 },
    content: { type: String, default: null },
    status: { type: String, default: 'Unreviewed' },
    reason: { type: String, default: null },
    time: {type: Date, default: 0 }
  }
}, {
    autoIndex: true,
    minimize: false,
}));

module.exports = suggestionSchema;