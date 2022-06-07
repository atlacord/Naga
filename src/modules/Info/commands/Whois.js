const { Command, CommandOptions } = require('axoncore');
const moment = require('moment-timezone');
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

        const member = msg.channel.guild.members.get(args[0]) || msg.member;

        let userRoles, sortedRoles, roles, roleColor;

        if (member.roles.length) {
            userRoles = member.roles.map(g => msg.channel.guild.roles.get(g));

            sortedRoles = userRoles.sort((a,b) => b.position - a.position); 
            roles = sortedRoles.map(r => `<@&${r.id}>`).join(", ");
            if (sortedRoles[0].color !== 0) {
                roleColor = sortedRoles[0].color;
            }
        } else {
            roles = 'No Roles';
            roleColor = this.utils.color.blue;
        }

        if(!args) {
            this.sendMessage(msg.channel, { 
                embed: {  
                    author: { name: msg.member.username + '#' + msg.member.discriminator, icon_url: msg.member.avatarURL },
                    thumbnail: { url: msg.member.avatarURL },
                    color: roleColor,

                    fields: [
                        { name: 'Username', value: `<@!${msg.member.id}>`, inline: true },
                        { name: 'Joined', value: `<t:${Math.floor(member.joinedAt / 1000)}:d><t:${Math.floor(member.joinedAt / 1000)}:T>`, inline: false },
                        { name: 'Registered', value: `<t:${Math.floor(member.createdAt / 1000)}:d><t:${Math.floor(member.createdAt / 1000)}:T>`, inline: false },
                        { name: 'Roles', value: roles, inline: false }
                    ],

                    footer: { text: `ID: ${msg.member.id}` },
                    timestamp: new Date(),
                }     
            })    
                 
        } else {
            this.sendMessage(msg.channel, {
                embed: {
                    author: { name: member.username + '#' + member.discriminator, icon_url: member.avatarURL },
                    thumbnail: { url: member.avatarURL },
                    description: 'Who dis?',
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
            })          
        }
    }
}
                        
module.exports = Whois;