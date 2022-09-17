const { Command, CommandPermissions, CommandOptions } = require('axoncore');

class MembersRaw extends Command {
    constructor(module) {
        super(module);

        this.label = 'raw';
        this.aliases = [
            'r'
        ];

        this.info = {
            name: 'members raw',
            description: 'View a list of members in a role in raw format',
            usage: 'members raw [role id]',
        };

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
                members.push(`${member.username}#${member.discriminator} (${member.id})`);
            }

        this.sendMessage(msg.channel, members.join('\n'));
    }
}

module.exports = MembersRaw;