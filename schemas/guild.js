const mongoose = require('mongoose')



const guildSchema = new mongoose.Schema({
    _id: String, 
    prefix: { type: String, default: null }
})



module.exports = mongoose.model('guilds', guildSchema)