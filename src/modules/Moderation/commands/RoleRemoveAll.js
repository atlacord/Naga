const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class RoleRemoveAll extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'removeall';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'removeall',
            description: 'Removes all roles from a member',
            usage: 'removeall [member]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 5000,
            guildOnly: true,
        });

        /**
         * @type {CommandPermissions}
         */
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.sentries,
                bypass: this.axon.staff.owners,
            },
        });
    }

     /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
        const guild = msg.channel.guild;
		const member = this.utils.resolveUser(guild, args[0]);

		if (!member) {
			return this.sendError(msg.channel, `Couldn't find that user.`);
		}

		const roles = guild.roles.filter(r => member.roles.includes(r.id));
		const rolenames = roles.filter(r => !r.managed).map(r => r.name);

		return member.edit({ roles: roles.filter(r => r.managed).map(r => r.id) },
				encodeURIComponent(`Responsible User: ${this.utils.fullName(msg.author)}`))
			.then(() => this.sendSuccess(msg.channel,
				`Removed the following roles from ${this.utils.fullName(member)}, ${rolenames.join(', ')}`))
			.catch(err => this.sendError(msg.channel,
				`I couldn't change the roles for that user. Please check my permissions and role position.`, err));
    }
}

module.exports = RoleRemoveAll;