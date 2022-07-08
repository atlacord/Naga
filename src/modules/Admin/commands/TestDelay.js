const { Command, CommandPermissions, CommandOptions } = require('axoncore');

class TestDelay extends Command {
    constructor(module) {
        super(module);

        this.label = 'testdelay';
        this.aliases = [];

        this.info = {
            name: 'testdelay',
            description: 'Tests our delay function - defaults to 10 seconds unless you provide a time (in ms)',
            usage: 'testdelay',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: null,
            hidden: true,
        } );
        
        /**
         * @type {CommandPermissions}
         */
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        });
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
        try {
            await this.utils.delayFor(parseInt(args[0]) || 10000)
            .then(this.sendMessage(msg.channel, 'fdas'))
            .catch((err) => this.sendError(msg.channel, err))
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.')
        }
    }
}

module.exports = TestDelay;

