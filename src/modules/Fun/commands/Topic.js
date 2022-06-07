const { Command, CommandOptions } = require('axoncore');
const topics = require('../../../assets/topics.json');

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
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    init() {
        return [ATLA]
    }

    async execute( { msg } ) {

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

