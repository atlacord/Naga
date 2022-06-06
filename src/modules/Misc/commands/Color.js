const { Command, CommandOptions } = require('axoncore');
const axios = require('axios');

class Color extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'color';
        this.aliases = [
            'colour'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'color',
            description: 'Display a color',
            usage: 'color [hex code]\nn!color random',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            guildOnly: false,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    hextoRGB(hex) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return [r, g, b];
    }

    async execute( { msg, args } ) {

        try {

        if (args[0] === 'random') {
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
                    thumbnail: { url: aurl },

                    fields: [
                        { name: 'Name', value: aname, inline: false },
                        { name: 'Hex', value: bhex, inline: false },
                        { name: 'RGB', value: `${rgb2.join(', ')}`, inline: false }
                    ],
                }
            })
        })
    } else {

        let hex = args[0].replace('#', '');
        // let checkHex = /^#[0-9A-F]{6}$/i;
        // if (! checkHex.test(args[0])) 

        const rgb = this.hextoRGB(hex);
        if (rgb.includes(NaN))
        return this.sendError(msg.channel, `Please provide a valid hex code.`);

        let color = parseInt(`0x${hex}`);
            if(hex === 'ffffff')
            color = '16777214'
            
            await axios.all([axios.get(`https://www.thecolorapi.com/id?hex=${hex}`)]).then(response => {
            var cname = response[0].data.name.value;
            var chex = response[0].data.hex.value;
            var curl = `http://placehold.it/300x300.png/${hex}/000000&text=%E2%80%8B`;

            this.sendMessage(msg.channel, {
                embed: {
                    title: 'Color',
                    color: color,
                    thumbnail: { url: curl },

                    fields: [
                        { name: 'Name', value: cname, inline: false },
                        { name: 'Hex', value: chex, inline: false },
                        { name: 'RGB', value: `${rgb.join(', ')}`, inline: false }
                    ]
                }
            })
        })
        }
    } catch(err) {
        this.sendError(msg.channel, err);
    }
    }
}

module.exports = Color;

