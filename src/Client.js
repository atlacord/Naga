const { AxonClient } = require('axoncore');
const cron = require('node-cron');
const Bot = require('./Bot');
const secret = require('../configs/secret.json');
const AniSchedule = require('../Util/Anischedule')
const modules = require('./modules/index');

/**
 * Example - Client constructor
 *
 * @author KhaaZ
 *
 * @class Client
 * @extends AxonClient
 */
class Client extends AxonClient {
    /**
     * @param {import('eris').Client} client
     * @param {import('axoncore').AxonOptions} axonOptions
     */
    constructor(client, axonOptions) {
        super(client, axonOptions, modules);

        this.param = 1; // personal stuff
        this._param = 2; // personal hidden stuff
    }

    /**
     * @returns {true}
     */
    onInit() {
        this.staff.contributors = [];
        return true;
    }

    /**
     * @returns {Promise<true>}
     */
    onStart() {
        return Promise.resolve(true);
    }

    /**
     * @returns {Promise<true>}
     */
    onReady() {
        return Promise.resolve(true);
    }

    initStatus() {
        // called after ready event
        // overrides default editStatus
        // used to setup custom status
        if (this.settings.debugMode === true) {
            this.botClient.editStatus('dnd', {
                name: `${this.info.name} | ${this.settings.prefixes[0]}help`,
                type: 0,
            });
        } else {
            this.botClient.editStatus('online', {
                name: `${this.info.name} | ${this.settings.prefixes[0]}help`,
                type: 0,
            });
        }
        /**
         * Initialise Anime notification schedule for Naga 
         * @type {?Anischedule}
         */
        this.anischedule = new Anischedule(this)

    }

  

    // disabled
    /**
     * @param {import('discord.js').Message} msg
     * @param {import('axoncore').GuildConfig} guildConfig
     * @returns {Promise<import('discord.js').Message>}
     */
    // eslint-disable-next-line no-unused-vars
    $sendFullHelp(msg, guildConfig) {
        // override sendFullHelp method
        return this.axonUtils.sendMessage(msg.channel, 'Full Help override');
    }

    // disabled
    /**
     * @param {import('axoncore').Command} command
     * @param {import('axoncore').CommandEnvironment} env
     * @returns {Promise<import('discord.js').Message>}
     */
    $sendHelp(command, env) {
        // override sendHelp method
        return this.axonUtils.sendMessage(env.msg.channel, `Help override for ${command.label}`);
    }    
}

module.exports = Client;
