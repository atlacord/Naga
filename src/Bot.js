const Eris = require('eris');

const { AxonOptions } = require('axoncore');

const Client = require('./Client');

const botConfig = require('../configs/config.json');
const secret = require('../configs/secret.json');
const lang = require('../configs/lang.json');
const ExtraUtils = require('./ExtraUtils');

const axonOptions = new AxonOptions( {
    prefixes: botConfig.prefixes,
    settings: botConfig.settings,
    lang,
    // logo: logo, borkeds

    info: botConfig.info,
    staff: botConfig.staff,
    template: botConfig.template,
    custom: {
        param: 1,
    },
},
secret.webhooks,
{
    utils: ExtraUtils,
    logger: 1,
    DBProvider: 2,

    axonConfig: botConfig,
    guildConfig: null,
} );

/**
 * new AxonClient(token, erisOptions, AxonOptions, modules)
 *
 * new Client(token, erisOptions, AxonOptions) => Modules imported in Client
 */
const client = new Eris.Client(
    secret.bot.token,
    {
        autoreconnect: true,
        defaultImageFormat: 'png',
        defaultImageSize: 4096,
        disableEveryone: true,
        getAllUsers: false,
        messageLimit: 100,
        restMode: true,
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
        ]
    },
);

const Bot = new Client(
    client,
    axonOptions,
);

module.exports = Bot;
