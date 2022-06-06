const { Command, CommandOptions } = require('axoncore');

class Jumbo extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'jumbo';
        this.aliases = [
            'extract'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'jumbo',
            description: 'Extract an emote URL (useful for mobile users)',
            usage: 'fusion',
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

    async execute({ msg, args }) {

        const EmoteRegex = new RegExp(/<(a)?:(\w+):(\d+)>/, "gmi");
        if(!args[0]) return this.sendError(msg.channel, 'Please provide an emote.');
        const result = EmoteRegex.exec(args[0]);
        if(!result) return this.sendError(msg.channel, 'Please provide a valid emote.');
        const url =  `https://cdn.discordapp.com/emojis/${result[3]}${result[1] ? ".gif" : ".png"}?v=1`;

        this.sendMessage(msg.channel, {
             embed: {
                color: this.utils.color.blue,
                title: `${result[2]}`,
                image: {
                    url: url
                },
                footer: {
                    // icon_url: this.utils.image.info,
                    text: `${result[3]}`
                }
            }
        });
    }
}

module.exports = Jumbo;

