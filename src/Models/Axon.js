const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const axonSchema = new Schema( {
    id:           { type: String, required: true, index: true }, // ID
    prefix:       { type: String, default: 'n!' },
    createdAt:    { type: Date, default: Date.now }, // date of schema creation
    updatedAt:    { type: Date, default: Date.now }, // data of last DB update
    bannedGuilds: { type: Array, default: [] }, // array of ids => cache into Set
    bannedUsers:  { type: Array, default: [] }, // array of ids => cache into Set
}, {
    strict: false,
    minimize: false,
} );

module.exports = { name: 'Axon', schema: axonSchema };
