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

        let team = [];

        for (let owner = 0; owner < this.axon.staff.owners.length; owner += 1) {
            let member = await this.bot.getRESTUser(this.axon.staff.owners[owner]);
            team.push(`${member.username}#${member.discriminator}`)
            console.log(team)
        }
    
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
                    { name: "Developers", value: team.join('\n')}
                ],
        
                footer: { text: `${this.bot.user.username} | PID: ${process.pid} | Uptime: ${duration}` }
                }
            }));
        } catch(err) {
        this.error(msg, err, 'internal', err);
        }
    }
}

module.exports = Info;
