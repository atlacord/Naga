const { Command, CommandPermissions, CommandOptions } = require('axoncore');

const { inspect } = require('util');
const { exec } = require('child_process');

class Build extends Command {
    constructor(module) {
        super(module);

        this.label = 'build';
        this.aliases = ['update'];

        this.info = {
            name: 'build',
            description: 'Update Naga to the latest version',
            usage: 'build',
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

    async execute({ msg }) {

        try {
            this.sendSuccess(msg.channel, `Updating ${this.bot.user.username}`);

            await exec('rm -rf ../../../../package.json', (error, stdout) => {
                const outputType = error || stdout;
                var output = outputType;
                if (typeof outputType === 'object') {
                    output = inspect(outputType, {
                        depth: Infinity
                    });
                }
            })
            console.log('Deleted package.json');
 
            await exec('git pull origin main', (error, stdout) => {
                const outputType = error || stdout;
                var output = outputType;
                if (typeof outputType === 'object') {
                    output = inspect(outputType, {
                        depth: Infinity
                    });
                }
            })
            console.log('Pulled from git!');

            await exec('pm2 restart NagaV2', (error, stdout) => {
                const outputType = error || stdout;
                var output = outputType;
                if (typeof outputType === 'object') {
                    output = inspect(outputType, {
                        depth: Infinity
                    });
                }
            })
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}

module.exports = Build;

