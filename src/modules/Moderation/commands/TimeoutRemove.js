const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class RemoveTimeout extends Command {
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
            description: 'Removes a timeout from a member.',
            usage: 'timeout remove [user]',
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
        try {
            const member = this.utils.resolveUser(msg.channel.guild, args[0]);
            let limit = null;

            this.moderations.setTimeout(msg, member, limit);

        } catch (err) {
            this.sendError(msg.channel, err);
        }
    }   
}

module.exports = RemoveTimeout;