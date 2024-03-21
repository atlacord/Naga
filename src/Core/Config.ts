import Naga from '../../';
import * as djs from 'discord.js';

const pkg = require('../../package.json');

let config: Naga.NagaConfig = {
    name: pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1),
    version: pkg.version,
    author: 'Kyle S',
    prefix: 'n.',
    adminPrefix: '$',
    state: 1341,
    stateName: 'Development',
    client: {
        id: '966189242969636866',
        token: process.env.TOKEN,
        options: {
            allowedMentions: { parse: [ 'roles'] },
            fetchAllUsers: true,
            intents: process.env.INTENTS as unknown as djs.IntentsBitField,
            messageCacheSize: 5000,
        }
    },
    database: {
        uri: process.env.DB_CONNECTION,
    },
    emojis: {
        success: '',
        error: '',
        info: ''
    },
    status: [
        { name: 'Testing', type: 0 },
        { name: 'Naga v3', type: 0 },
        { name: 'n.help', type: 0 }
    ],
    avatarGuild: '370708369951948800',
    testGuilds: [ 
        '546800805060280352', // Quantum Biotics, Inc. (soda)
        '504742982604554241' // TwoDog Fan Club
    ],
    developers: [ 
        '254814547326533632', // Soda
        '123261299864895489' // TwoDog
    ],
    contributors: [ 
        '260600155630338048' // Avatar Bolin
    ],
    pkg: pkg,
};

export default config;