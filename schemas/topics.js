const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const topicSchema = new mongoose.Schema({
    topic: String
})

autoIncrement.initialize(mongoose.connection)

topicSchema.plugin(autoIncrement.plugin, 'topic')

module.exports = mongoose.model('topics', topicSchema)