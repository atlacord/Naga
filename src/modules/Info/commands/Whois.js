const { Command, CommandOptions } = require('axoncore');
const moment = require('moment-timezone');
const profile = require('../../../Models/Profile');
require('moment-duration-format');

class Whois extends Command {

    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'whois';
        this.aliases = [
            'w',
            'who',
            'userinfo',
 //           'profile',
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'whois',
            description: 'Get some info on a user!',
            usage: 'whois',
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

    async execute({ msg, args }) {

        let staff = [];

        const member = args.length ? this.utils.resolveUser(msg.channel.guild, args.join(' ')) : msg.member;

        if (!member) {
            this.sendError(msg.channel, `Couldn't find member ${args.join(' ')}`);
        }


		const perms = {
			administrator: 'Administrator',
			manageGuild: 'Manage Server',
			manageRoles: 'Manage Roles',
			manageChannels: 'Manage Channels',
			manageMessages: 'Manage Messages',
			manageWebhooks: 'Manage Webhooks',
			manageNicknames: 'Manage Nicknames',
			manageEmojis: 'Manage Emojis',
            manageThreads: 'Manage Threads',
            viewGuildInsights: 'View Server Insights',
			kickMembers: 'Kick Members',
			banMembers: 'Ban Members',
			mentionEveryone: 'Mention Everyone',
		};


        let userRoles, sortedRoles, roles, roleColor;

        if (member.roles.length) {
            userRoles = member.roles.map(g => msg.channel.guild.roles.get(g));

            sortedRoles = userRoles.sort((a,b) => b.position - a.position); 
            roles = sortedRoles.map(r => `<@&${r.id}>`).join(", ");

            if (roles.length >= 1024) {
                roles = 'Too many roles 💀';
            }

            if (sortedRoles[0].color === 0) {
                roleColor = 9031664;
            } else {
                roleColor = sortedRoles[0].color;
            }

        } else {
            roles = 'No Roles';
            roleColor = this.utils.getColor('blue');
        }

        for (let i = 0; i < this.utils.checkStaff(member).length; i += 1) {
            staff.push(this.utils.checkStaff(member)[i]);
        }

        const joinPos = [...msg.channel.guild.members.values()]
        .sort((a, b) => (a.joinedAt < b.joinedAt) ? -1 : ((a.joinedAt > b.joinedAt) ? 1 : 0))
        .filter(m => !m.bot)
        .findIndex(m => m.id === member.id) + 1;

        let bio = null;
        let level = null;
        await profile.findById(member.id, (err, doc) => {
            bio = doc.data.profile.bio;
            level = doc.data.global_level.toString();
        });

        let embed = {  
            author: { name: member.username + '#' + member.discriminator, icon_url: member.avatarURL },
            thumbnail: { url: member.avatarURL },
            color: roleColor,
            description: bio || null,

            fields: [
                { name: 'Username', value: `<@!${member.id}>`, inline: true },
                { name: 'Level', value: level || 'N/A', inline: false },
                { name: 'Join Position', value: joinPos.toLocaleString() || 'None', inline: false },
                { name: 'Joined', value: `<t:${Math.floor(member.joinedAt / 1000)}:F>`, inline: false },
                { name: 'Registered', value: `<t:${Math.floor(member.createdAt / 1000)}:F>`, inline: false },
                { name: `Roles [${member.roles.length}]`, value: roles, inline: false }
            ],

            footer: { text: `ID: ${member.id}` },
            timestamp: new Date(),
        }

        if (member.permissions) {
            const memberPerms = member.permissions.json;
            const infoPerms = [];
            for (let key in memberPerms) {
                if (!perms[key] || memberPerms[key] !== true) continue;
                if (memberPerms[key]) {
                    infoPerms.push(perms[key]);
                }
                infoPerms.sort();
            }
    
            if (infoPerms.length) {
                embed.fields.push({ name: 'Server Permissions', value: infoPerms.join(', '), inline: false });
            }
        }
    
        if (staff.length > 0) {
            embed.fields.push({ name: 'Special Acknowledgements', value: staff.join(', '), inline: false });
        }

        this.sendMessage(msg.channel, { embed })  
    }
}
                        
module.exports = Whois;