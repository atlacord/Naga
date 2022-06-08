const { Command, CommandOptions } = require('axoncore');
const moment = require('moment-timezone');
require('moment-duration-format');

class Serverinfo extends Command {

    /**
     * @param {import('axoncore').Module} module
     */

    constructor(module) {
        super(module);

        this.label = 'serverinfo';
        this.aliases = [
            'server',
            'guildinfo',
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'serverinfo',
            description: 'View server info',
            usage: 'serverinfo',
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

     execute ( { msg } ) {

        try {
    
        let bTier = {
            "0": "Level 0",
            "1": "Level 1",
            "2": "Level 2",
            "3": "Level 3",
        };
    
        const guild = msg.channel.guild;
		const categories = guild.channels.filter(c => c.type === 4).length;
		const textChannels = guild.channels.filter(c => c.type === 0).length;
		const voiceChannels = guild.channels.filter(c => c.type === 2).length;

        let roles = msg.member.roles.map(r => msg.channel.guild.roles.get(r)).filter(r => r.color);
        roles.sort((a,b) => b.position - a.position);
        let roleColor = roles[0].color;
    
        this.sendMessage(msg.channel, {
            embed: {
            author: { 
                name: guild.name, 
                icon_url: guild.iconURL
            },
            color: roleColor,
            thumbnail: { 
                url: guild.iconURL 
            },
            description: `${guild.description || 'No description'}`,
            
            fields: [
            { name: 'Total Members', value: guild.memberCount, inline: true },
            { name: 'Boost Level', value: bTier[guild.premiumTier], inline: true },
            { name: 'Boosters', value: guild.premiumSubscriptionCount, inline: true },
            { name: 'Categories', value: categories, inline: true },
            { name: 'Text Channels', value: textChannels, inline: true },
            { name: 'Voice Channels', value: voiceChannels, inline: true },
            { name: 'Rules Channel', value: `${guild.rulesChannel || 'None'}`, inline: true },
            { name: `Roles`, value: guild.roles.size, inline: true },
            { name: `Emojis`, value: guild.emojis.length, inline: true },
            { name: 'Owner', value: `<@${guild.ownerID}>`, inline: false },
            // { name: `Created`, value: `${moment(guild.createdAt).tz("America/New_York").format("dddd, MMMM D, YYYY h:mm A")}`, inline: false }
            { name: `Created`, value: `<t:${Math.floor(guild.createdAt / 1000)}:f>`, inline: false } // This one uses Discord's timestamp formatting
            ],
    
            footer: { text: `Server ID: ${guild.id}` },
            timestamp: new Date()
        }
        })
    } catch (err) {
        this.sendError(msg.channel, err);
    }
}
}

module.exports = Serverinfo;