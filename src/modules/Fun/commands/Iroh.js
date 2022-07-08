const { Command, CommandOptions } = require('axoncore');
const axios = require('axios');
// const quotes = require('../../../assets/irohquotes.json');

class Iroh extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'iroh';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'iroh',
            description: 'Sends a random quote from Uncle Iroh',
            usage: 'iroh',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 50000,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute( { msg } ) {

        let quotes = await axios.get('http://atla.sh/iroh.json')
        quotes = quotes.data;

        const quote = Math.floor(Math.random() * quotes.length);
        return this.sendMessage(msg.channel, {
            embed: {
                color: this.utils.color.blue,
                thumbnail: { url: 'https://i.pinimg.com/originals/4d/8c/d0/4d8cd09d595ab1cefb8098d4ec13ec0b.png' },
                description: quotes[quote]
            }
        });
    }
}


module.exports = Iroh;

