const { Command, CommandOptions } = require('axoncore');
const axios = require('axios');

class Randomcolor extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'randomcolor';
        this.aliases = [
            'randomcolour',
            'rc'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'randomcolor',
            description: 'Display a random color',
            usage: 'randomcolor',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: false,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    hexToRgb(hex) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return [r, g, b];
    }

    async execute( { msg } ) {
    
        try {

            let int = (Math.random() * (1 << 24) | 0);
            let ahex = ('00000' + int.toString(16)).slice(-6);
            let rgb2 = [(int & 0xff0000) >> 16, (int & 0x00ff00) >> 8, (int & 0x0000ff)];

            await axios.all([axios.get(`https://www.thecolorapi.com/id?hex=${ahex}`)]).then(response => {

            var aname = response[0].data.name.value;
            var bhex = response[0].data.hex.value;
            var aurl = `http://placehold.it/300x300.png/${ahex}/000000&text=%E2%80%8B`;
    
                this.sendMessage(msg.channel, {
                    embed: {
                        title: 'Color',
                        color: int,
                        thumbnail: { 
                            url: aurl 
                        },
    
                        fields: [
                            { name: 'Name', value: aname, inline: false },
                            { name: 'Hex', value: bhex, inline: false },
                            { name: 'RGB', value: `${rgb2.join(', ')}`, inline: false }
                        ],
                    }
                })
            })
        } catch(err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}

module.exports = Randomcolor;