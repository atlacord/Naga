const { Command, CommandPermissions, CommandOptions } = require('axoncore');
const MembersRaw = require('./MembersRaw');

class Members extends Command {
    constructor(module) {
        super(module);

        this.label = 'members';
        this.aliases = [
            'dump',
        ];

        this.info = {
            name: 'members',
            description: 'View a list of members in a role',
            usage: 'members [role id]',
        };

        this.hasSubcmd = true;

      /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: null,
            hidden: true,
        } );
        
        /**
         * @type {CommandPermissions}
         */
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.dailis,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    init() {
        return [MembersRaw];
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {

        let members = [];

        const role = this.utils.resolveRole(msg.channel.guild, args.join(' '));

        let rolemembers = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes(role.id)));
            for (let i in rolemembers) {
                let member = await this.bot.getRESTUser(rolemembers[i].id);
                members.push(this.utils.fullName(member));
            }

        let embed = {
            color: role.color || this.utils.getColor('blue'),
            author: { name: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
            fields: [],
            footer: { text: `Total members: ${members.length}` }
        }

        if (members.length >= 69) {
            embed.fields.push({ name: role.name, value: 'Too many members to show!' })
        } else {
            embed.fields.push({ name: role.name, value: members.join('\n') })
        }

        this.sendMessage(msg.channel, {embed});
    }
}

module.exports = Members;