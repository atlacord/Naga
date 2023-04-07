const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const RespondApprove = require('./RespondApprove');
const RespondDeny = require('./RespondDeny');
const RespondEdit = require('./RespondEdit');

class Respond extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'respond';
        this.aliases = [];

        this.hasSubcmd = true;

        this.info = {
            name: 'respond',
            description: 'Respond to a suggestion',
            usage: 'respond',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.sentries,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    init() {
        return [RespondApprove, RespondDeny, RespondEdit];
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    execute({ msg }) {
        try {
            this.sendMessage(msg.channel, `Please use \`${this.axon.settings.prefixes}respond approve/deny\`!`)
        } catch (err) {
            this.utils.logError(msg, err, 'command', `An error occurred: ${err.message}`);
        }
    }
}

module.exports = Respond;