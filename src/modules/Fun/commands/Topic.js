const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const axios = require('axios');
// const topics = require('../../../assets/topics.json');

const ATLA = require('./ATLA');

class Topic extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'topic';
        this.aliases = [
        ];

        this.hasSubcmd = true;

        this.info = {
            name: 'topic',
            description: 'Provides a random topic',
            usage: 'topic',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 5000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            custom: (msg) => msg.channel.parentID !== '372086709950611456',
        });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    init() {
        return [ATLA]
    }

    async execute( { msg } ) {

        let topics = await axios.get('http://atla.sh/topics.json');
        topics = topics.data;

        const topic = Math.floor(Math.random() * topics.length);
        return this.sendMessage(msg.channel, {
            embed: {
                color: this.utils.color.blue,
                description: topics[topic]
            }
        });
    }
}


module.exports = Topic;

