const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchingSchema = new Schema( {
    _id: String, 
    channelID: { type: String, default: null},
    data: { type: Array, default: []}

}, {
    versionKey: false
} );

module.exports = { name: 'GuildWatching', schema: watchingSchema };
