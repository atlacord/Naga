const { Command, CommandOptions } = require('axoncore');
const moment = require('moment-timezone');
require("moment-duration-format");
const version = require('../../../../package.json').version

class Info extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'info';
        this.aliases = [
            'about',
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'info',
            description: 'View bot info',
            usage: 'info',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute( { msg } ) {
        const duration = moment.duration(this.bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    
        try {

            this.sendMessage(msg.channel, ({
                embed: {
                title: 'Naga',
                color: this.utils.color.blue,

                thumbnail: { 
                    url: this.bot.user.avatarURL 
                },

                fields: [
                    { name: "Version", value: version, inline: true },
                    { name: "Library", value: `eris`, inline: true },
                    { name: "Created", value: `${moment(this.bot.user.createdAt).tz("America/New_York").format("M/D/YYYY")}`, inline: true },
                    { name: "Note", value: 'This is the first version of Naga v2. Please report any issues to TwoDog or soda!'}
                ],
        
                footer: { text: `${this.bot.user.username} | PID: ${process.pid} | Uptime: ${duration}` }
                }
            })
        );
    } catch(err) {
        this.sendError(msg.channel, err);
        }
    }
}

module.exports = Info;
