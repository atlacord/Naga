const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class RoleAdd extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'add';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'add',
            description: 'Adds a role(s) to a member',
            usage: 'add [member] [role]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 2,
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
        const invalidRoles = [];
        const roleChanges = [];

        const member = this.utils.resolveUser(guild, args[0]);
        const roles = [...member.roles];

        const roleArgs = args.slice(1).join(' ')
        .replace(/, /g, ',')
        .split(',');

        for (const search of roleArgs) {
            const role = this.utils.resolveRole(guild, search);

            if (!role) {
                invalidRoles.push(search);
                continue;
            }

            roleChanges.push({ role });
        }

        if (invalidRoles.length) {
            return this.error(message.channel, `I can't find the role(s) ${invalidRoles.join(', ')}.`);
        }

        if (!roleChanges.length) {
            return 
        }

        const changes = [];

        for (const change of roleChanges) {
            roles.push(change.role.id);
            changes.push(`added ${change.role.name}`);
        }

        const diff = roles.filter((r) => !member.roles.includes(r));
        if (!diff || !diff.length) {
            return this.sendError(msg.channel, 'No changes were made.');
        }

        return (await member).edit({ roles }, encodeURIComponent(`Responsible User: ${this.utils.fullName(msg.author)}`))
            .then(() => this.sendSuccess(msg.channel, `Changed roles for ${this.utils.fullName(member)}, ${changes.join(', ')}`))
            .catch(err => this.sendError(msg.channel, `I couldn't change the roles for that user. Please check my permissions and role position.\n ${err}`));
    }   
}

module.exports = RoleAdd;