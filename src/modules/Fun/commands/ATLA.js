const { Command, CommandOptions, CommandPermissions } = require('axoncore');
// const atlatopics = require('../../../assets/atlatopics.json');
const axios = require('axios');

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
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            channels: {
                bypass: ['372086844956868618', '721604232532459540']
            }
        });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute( { msg } ) {

        let atlatopics = await axios.get('http://atla.sh/topics.json');
        atlatopics = atlatopics.data;

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

