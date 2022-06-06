const { Command, CommandOptions } = require('axoncore');
const atlatopics = require('../../../Assets/atlatopics.json');

class ATLA extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'atla';
        this.aliases = [ 'atla' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'topic atla',
            description: 'Provides a random topic about ATLA!',
            usage: 'topic atla',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
            guildOnly: false,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute( { msg } ) {

        const topic = Math.floor(Math.random() * atlatopics.length);
        return this.sendMessage(msg.channel, {
            embed: {
                color: this.utils.color.blue,
                description: atlatopics[topic]
            }
        });
    }
}


module.exports = ATLA;

