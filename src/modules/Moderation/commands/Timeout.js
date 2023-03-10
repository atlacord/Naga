const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const ModUtils = require('../ModUtils');
const TimeoutRemove = require('./TimeoutRemove');

class Timeout extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'timeout';
        this.aliases = [];

        this.hasSubcmd = true;

        this.info = {
            name: 'timeout',
            description: 'Times out a member for a specified time (in hours)',
            usage: 'timeout [user] [length (in hours)]',
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

        this.moderations = new ModUtils();
    }

    init() {
        return [TimeoutRemove];
    }

     /**
     * @param {import('axoncore').CommandEnvironment} env
     */

      async execute({ msg, args }) {
        try {
            const member = this.utils.resolveUser(msg.channel.guild, args[0]);
            const limit = parseInt(args[1].replace('h', '')) * 60 * 60 * 1000;

            this.moderations.setTimeout(msg, member, limit);

        } catch (err) {
            this.sendError(msg.channel, err);
        }
    }   
}

module.exports = Timeout;