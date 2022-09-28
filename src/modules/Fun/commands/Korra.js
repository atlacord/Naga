const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const korratopics = require('../../../assets/korratopics.json');
// const axios = require('axios');

class Korra extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'lok';
        this.aliases = [ 'lok', 'korra' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'topic lok',
            description: 'Provides a random topic about Legend of Korra!',
            usage: 'topic lok',
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

        // let atlatopics = await axios.get('http://atla.sh/topics.json');
        // atlatopics = atlatopics.data;

        const topic = Math.floor(Math.random() * korratopics.length);
        return this.sendMessage(msg.channel, {
            embed: {
                color: this.utils.getColor('blue'),
                description: korratopics[topic]
            }
        });
    }
}


module.exports = Korra;

