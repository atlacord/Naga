const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema( {
    /** Index */
    id:              { type: String, required: true, index: true }, // GUILD ID
    prefix:          { type: String, default: 'n!' },
    modules:         { type: Array, default: [] }, // Array of disabled modules (labels)
    commands:        { type: Array, default: [] }, // Array of disabled commands (labels)
    eventListeners:  { type: Array, default: [] }, // Array of disabled listeners (labels)
    createdAt:       { type: Date, default: Date.now }, // date of schema creation
    updatedAt:       { type: Date, default: Date.now }, // data of last DB update
    ignoredUsers:    { type: Array, default: [] }, // ids
    ignoredRoles:    { type: Array, default: [] }, // ids
    ignoredChannels: { type: Array, default: [] }, // ids
    modOnly:         { type: Boolean, default: false },
    modRoles:        { type: Array, default: [] },
    modUsers:        { type: Array, default: [] },

}, {
    autoIndex: true,
    minimize: false,
} );

module.exports = { name: 'Guild', schema: guildSchema };
