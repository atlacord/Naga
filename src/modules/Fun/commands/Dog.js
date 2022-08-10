const { Command, CommandOptions } = require('axoncore');
const axios = require('axios');

class Dog extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'dog';
        this.aliases = [
            'puppy',
            'doggo',
            'TwoDog'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'dog',
            description: 'Sends an cute puppy',
            usage: 'dog',
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

    async execute( { msg } ) {

        try {

            await axios.all([axios.get(`https://dog.ceo/api/breeds/image/random`)]).then(res => {
                var curl = res[0].data.message;

                this.sendMessage(msg.channel, {
                    embed: {
                        color: this.utils.getColor('darkblue'),
                        description: `**Found an adorable doggo!**`,
                        image: { 
                            url: curl 
                        }
                    }
                });
            })
        } catch (err) {
            this.utils.logError(msg, err, 'api', `Error 404: Dog not found.`);
        }
    }
}

module.exports = Dog;

