const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class RoleRemove extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'remove';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'remove',
            description: 'Removes a role(s) from a member',
            usage: 'remove [member] [role]',
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
        const invalidRoles = [];
        const roleChanges = [];

        const member = this.utils.resolveUser(guild, args[0]);
        const roles = [...member.roles];

        const roleArgs = args.slice(1).join(' ')
        .replace(/, /g, ',')
        .split(',');

        for (const search of roleArgs) {
            const role = this.utils.resolveRole(msg.guildID, search);

            if (!role) {
                invalidRoles.push(search);
                continue;
            }

            roleChanges.push({ role, index: roles.indexOf(role.id) });
        }

        if (invalidRoles.length) {
            return this.error(message.channel, `I can't find the role(s) ${invalidRoles.join(', ')}.`);
        }

        if (!roleChanges.length) {
            return this.sendError(msg.channel, 'No changes were made.')
        }

        const changes = [];

        for (const change of roleChanges) {
            roles.splice(change.index, 1);
            changes.push(`removed ${change.role.name}`);
        }

        const diff = roles.filter((r) => !member.roles.includes(r));
        if (!diff || !diff.length) {
            return this.sendError(msg.channel, 'No changes were made.');
        }

        return (await member).edit({ roles }, encodeURIComponent(`Responsible User: ${msg.author.username}#${msg.author.discriminator}`))
            .then(() => this.sendSuccess(msg.channel, `Changed roles for ${member.username}#${member.id}, ${changes.join(', ')}`))
            .catch(err => this.sendError(msg.channel, `I couldn't change the roles for that user. Please check my permissions and role position.\n ${err}`));
    }   
}

module.exports = RoleRemove;