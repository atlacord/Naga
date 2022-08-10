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
            "1": "<:boost:715846186128375850> Level 1",
            "2": "<:boost:715846186128375850> Level 2",
            "3": "<:boost:715846186128375850> Level 3",
        };

        let formattedFeatures = {
            'AUTO_MODERATION': 'Automod',
            'COMMUNITY': 'Community Server',
            'DISCOVERABLE': 'Server Discovery',
            'FEATURABLE': 'Featured Server',
            'GUILD_HOME_TEST': 'Home Page Beta',
            'MEMBER_VERIFICATION_GATE_ENABLED': 'Member Screening',
            'MONETIZATION_ENABLED': 'Server Monetization Program',
            'NEWS': 'News Channels',
            'PARTNERED': '<a:discordPartner:1006803535238811658> **Discord Partner**',
            'PREVIEW_ENABLED': 'Previewable Server',
            'PRIVATE_THREADS': 'Private Threads',
            'ROLE_ICONS': 'Role Icons',
            'TEXT_IN_VOICE_ENABLED': 'Text in Voice',
            'TICKETED_EVENTS_ENABLED': 'Ticketed Events',
            'VANITY_URL': 'Vanity URL',
            'VERIFIED': 'Verified Server',
            'VIP_REGIONS': 'VIP Voice Regions',
        }
    
        const guild = this.bot.guilds.get('370708369951948800');
		const categories = guild.channels.filter(c => c.type === 4).length;
		const textChannels = guild.channels.filter(c => c.type === 0).length;
		const voiceChannels = guild.channels.filter(c => c.type === 2).length;

        let roles = guild.members.get(msg.member.id).roles.map(r => guild.roles.get(r)).filter(r => r.color);
        roles.sort((a,b) => b.position - a.position);
        let roleColor = roles[0].color;

        let features = [];

        for (let i in guild.features) {
            if (formattedFeatures[guild.features[i]] !== undefined) {
                features.push(formattedFeatures[guild.features[i]]);
            }
        }

        console.log(features);
    
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
            { name: 'Total Members', value: guild.memberCount.toLocaleString(), inline: true },
            { name: 'Boost Level', value: bTier[guild.premiumTier], inline: true },
            { name: 'Boosters', value: guild.premiumSubscriptionCount, inline: true },
            { name: 'Categories', value: categories, inline: true },
            { name: 'Text Channels', value: textChannels, inline: true },
            { name: 'Voice Channels', value: voiceChannels, inline: true },
            { name: 'Rules Channel', value: `<#${guild.rulesChannelID}>`, inline: true },
            { name: `Roles`, value: guild.roles.size, inline: true },
            { name: `Emojis`, value: guild.emojis.length, inline: true },
            { name: 'Owner', value: `<@${guild.ownerID}>`, inline: true },
            // { name: `Created`, value: `${moment(guild.createdAt).tz("America/New_York").format("dddd, MMMM D, YYYY h:mm A")}`, inline: false }
            { name: `Created`, value: `<t:${Math.floor(guild.createdAt / 1000)}:f>`, inline: true }, // This one uses Discord's timestamp formatting
            { name: 'Server Features', value: features.sort().join(', '), inline: false },
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