const { Command, CommandOptions } = require('axoncore');
require('moment-duration-format');

class RoleInfo extends Command {

    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'roleinfo';
        this.aliases = [ 'ri' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'roleinfo',
            description: 'Get some info on a role!',
            usage: 'roleinfo [role]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            guildOnly: true,
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
        try {

            const role = this.utils.resolveRole(msg.channel.guild, args.join(' '));

            if (!role) {
                this.sendError(msg.channel, `Couldn't find role ${args.join(' ')}`);
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

            if (role.color === 0) {
                role.color = 9031664;
            }

            let embed = {  
                color: role.color,
                author: { 
                    name: role.name, 
                    icon_url: null 
                },
                thumbnail: { url: null },

                fields: [
                    { name: 'Name', value: role.name, inline: true },
                    { name: 'Color', value: `#${role.color.toString(16)}`, inline: true },
                    { name: 'Hoisted', value: role.hoist, inline: true },
                    { name: 'Mentionable', value: role.mentionable, inline: true },
                    { name: 'Position', value: role.position, inline: true },
                    { name: 'Managed via Integration', value: role.managed, inline: false },
                    { name: 'Created', value: `<t:${Math.floor(role.createdAt / 1000)}:F>`, inline: false },
                ],
                footer: { text: `ID: ${role.id}`}
            }

            if (role.icon !== null) {
                embed.author.icon_url = role.iconURL;
                embed.thumbnail.url = role.iconURL;
            }

            if (role.permissions) {
                const rolePerms = role.permissions.json;
                const infoPerms = [];
                for (let key in rolePerms) {
                    if (!perms[key] || rolePerms[key] !== true) continue;
                    if (rolePerms[key]) {
                        infoPerms.push(perms[key]);
                    }
                    infoPerms.sort();
                }
        
                if (infoPerms.length) {
                    embed.fields.push({ name: 'Role Permissions', value: infoPerms.join(', '), inline: false });
                }
            }

            this.sendMessage(msg.channel, { embed });
        } catch (err) {
            this.sendError(msg.channel, err);
        }
    }
}
                        
module.exports = RoleInfo;