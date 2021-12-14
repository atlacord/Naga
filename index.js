const Chariot = require('chariot.js');
require('dotenv').config(); 
const mongoose = require('mongoose');


class Umi extends Chariot.Client {
    constructor() {
        super(new Chariot.Config(
            process.env.TOKEN, 
            {
                prefix: ['??', '@mention'],
                guildPrefixes: [
                    { guildID: '<Guild 1>', prefix: '?' },
                    { guildID: '<Guild 1>', prefix: ';' }
                ],
                defaultHelpCommand: true,
                primaryColor: '89cff0',
                owner: [
                    '123261299864895489'
                ],
                excludeDirectories: [
                    'todo'
                ],
                 customLocales: {
                    missingPermissions: 'Command **{command}** requires following permissions: **{missingPermissions}**',
                    owner: 'You should not be playing around with this! I only listen to TwoDog for this!',
                    cooldown: 'Just wait **{timeLeftFormatted}** before spamming **{command}** yet again ...',
                    nsfw: 'Oi you naughty lil thang, **{command}** is an NSFW command and cannot be used here.',
                    userPermissions: {
                        title: 'Hold up ...',
                        description: 'You gtotta have these permissions before you can do this! **{missingUserPermissions}**',
                    }
                }
            },
            {
                messageLimit: 50,
                defaultImageFormat: 'png',
                allowMentions: {
                    everyone: false,
                    roles: false,
                }
                
            }
        ));
    }
}

class Mongoose{
    
    init() { mongoose.connect(`mongodb://Nanami:gQDyc6UonQdUCdSk@nanami-shard-00-00.xl1ps.mongodb.net:27017,nanami-shard-00-01.xl1ps.mongodb.net:27017,nanami-shard-00-02.xl1ps.mongodb.net:27017/Nanami?ssl=true&replicaSet=atlas-11dg2z-shard-0&authSource=admin&retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true,}).catch(console.error)
        mongoose.connection.on('open', () => Chariot.Logger.event('Connection Opened...')) 
        mongoose.connection.on('connecting', () => Chariot.Logger.event('Connecting to MongoDB...'))
        mongoose.connection.on('connected', () => Chariot.Logger.event('Connected to MongoDB!'))
        mongoose.connection.on('err', (err) => Chariot.Logger.error(`Mongoose Error:\n${err.stack}`))
        mongoose.connection.on('disconnected', () => Chariot.Logger.event('Disconnected to MongoDB...'))
        mongoose.connection.on('reconnected', () => Chariot.Logger.event('Reconnected to MongoDB!'))
    } 
    }
    
    const database = new Mongoose({settings: {useNewUrlParser: true}, password: 'gQDyc6UonQdUCdSk'})
    
     database.init()






module.exports = new Umi();