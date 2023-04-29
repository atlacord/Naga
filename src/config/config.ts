import path from 'path';
const pkg = require('../../package.json');
import Naga from '../index.d';
import * as dotenv from 'dotenv';
dotenv.config();

const basePath = path.resolve(path.join(__dirname, '..'));

let config: Naga.NagaConfig = {
    name: 'NagaV3',
    author: 'soda#0001',
    developers: [
        '254814547326533632', // soda
        '123261299864895489', // TwoDog
        '260600155630338048' // Bo
    ],
    version: '3.0.0',
    prefix: process.env.DEFAULT_PREFIX,
    devPrefix: process.env.DEV_PREFIX,
    logLevel: 'debug',
    client: {
        id: process.env.CLIENT_ID,
        token: process.env.TOKEN,
        secret: process.env.CLIENT_SECRET,
        status: 'Naga v3 | Alpha Test',
        disableEveryone: true,
        getAllUsers: true,
        messageLimit: 1000,
        intents: [ 
            'guilds',  
            'guildBans', 
            'guildEmojis', 
            'guildIntegrations',
            'guildWebhooks',
            'guildInvites',
            'guildVoiceStates',
            'guildMessages',
            'guildMessageReactions',
            'guildMessageTyping',
            'directMessages',
            'directMessageReactions',
            'directMessageTyping',
            'guildPresences',
            'guildMembers'
        ],
    },
    database: {
        dsn: process.env.MONGO_DSN
    },
    emojis: {
        success: '<:yes:917982955362734100>',
        error: '<:no:917982868922335272>',
        info: ''
    },

    avatarGuild: '370708369951948800',
    testGuilds: [ 
        '370708369951948800', // ATLA
        '887080200217710622', // Future Industries
        '546800805060280352', // Quantum Biotics
        '741322877684678657', // Funhouse
        '736344840253472830', // Lake Laogai
        '824456600629673994', // ATLA Emote Server
    ],
    modules: [
        'Info'
    ],

    pkg: pkg,

    paths: {
        base: basePath,
        modules: path.join(basePath, 'modules'),
        events: path.join(basePath, 'events'),
    }
}

export default config;