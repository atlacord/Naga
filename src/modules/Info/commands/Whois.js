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
            'profile',
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

        const member = msg.channel.guild.members.get(args[0]) || msg.member;

        let userRoles, sortedRoles, roles, roleColor;

        if (member.roles.length) {
            userRoles = member.roles.map(g => msg.channel.guild.roles.get(g));

            sortedRoles = userRoles.sort((a,b) => b.position - a.position); 
            roles = sortedRoles.map(r => `<@&${r.id}>`).join(", ");
            if (sortedRoles[0].color === 0) {
                roleColor = 9031664;
            } else {
                roleColor = sortedRoles[0].color;
            }

        } else {
            roles = 'No Roles';
            roleColor = this.utils.color.blue;
        }

        for (let i = 0; i < this.utils.checkStaff(member).length; i += 1) {
            staff.push(this.utils.checkStaff(member)[i]);
        }

        if (!args) {
            profile.findById(msg.author.id, (err, doc) => {
            let embed = {  
                author: { name: msg.member.username + '#' + msg.member.discriminator, icon_url: msg.member.avatarURL },
                thumbnail: { url: msg.member.avatarURL },
                color: roleColor,
                description: doc.data.profile.bio,

                fields: [
                    { name: 'Username', value: `<@!${msg.member.id}>`, inline: true },
                    { name: 'Joined', value: `<t:${Math.floor(member.joinedAt / 1000)}:d><t:${Math.floor(member.joinedAt / 1000)}:T>`, inline: false },
                    { name: 'Registered', value: `<t:${Math.floor(member.createdAt / 1000)}:d><t:${Math.floor(member.createdAt / 1000)}:T>`, inline: false },
                    { name: 'Roles', value: roles, inline: false }
                ],

                footer: { text: `ID: ${msg.member.id}` },
                timestamp: new Date(),
            }

            if (staff.length > 0) {
                embed.fields.push({ name: 'Special Acknowledgements', value: staff.join(', '), inline: false });
            }

            this.sendMessage(msg.channel, { embed })
        })
                 
        } else {
            profile.findById(member.id, (err, doc) => {
            let embed = {
                author: { name: member.username + '#' + member.discriminator, icon_url: member.avatarURL },
                thumbnail: { url: member.avatarURL },
                description: doc.data.profile.bio,
                color: roleColor,

                fields: [
                    { name: 'Username', value: `<@!${member.id}>`, inline: true },
                    { name: 'Joined', value: `<t:${Math.floor(member.joinedAt / 1000)}:d><t:${Math.floor(member.joinedAt / 1000)}:T>`, inline: false },
                    { name: 'Registered', value: `<t:${Math.floor(member.createdAt / 1000)}:d><t:${Math.floor(member.createdAt / 1000)}:T>`, inline: false },
                    { name: 'Roles', value: roles, inline: false }
                ],

                footer: { text: `ID: ${member.id}` },
                timestamp: new Date(),
            }

            if (staff.length > 0) {
                embed.fields.push({ name: 'Special Acknowledgements', value: staff.join(', '), inline: false });
            }
            this.sendMessage(msg.channel, { embed })          
        })
    }
}
}
                        
module.exports = Whois;