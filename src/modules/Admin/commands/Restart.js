const nodeUtil = require('util');

const {
    Command,
    CommandPermissions,
    CommandOptions,

} = require('axoncore');
const process = require('child_process');

class Restart extends Command {
    constructor(module) {
        super(module);

        this.label = 'restart';
        this.aliases = ['r'];

        this.info = {
            name: 'restart',
            description: 'Restart Naga',
            usage: 'restart',
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
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

async execute({ msg, args }) {
    try {
        process.exec(`pm2 restart NagaV2`, (error, stdout) => {
            const outputType = error || stdout;
            let output = outputType;
            if (typeof outputType === 'object') {
                output = inspect(outputType, {
                    depth: getMaxDepth(outputType, args.join(' '))
                });
            }
        });
    } catch (err) {
        this.logger.sendError(err);
        return this.sendError(msg.channel, err);
    }
}
}

module.exports = Restart;