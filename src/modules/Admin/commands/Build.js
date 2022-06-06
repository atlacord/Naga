const {
    Command,
    CommandPermissions,
    CommandOptions,
    CommandResponse,
    AxonEnums,
    Collection,
    Embed,
    Prompt,
    MessageCollector,
    Stack,
    Queue,
    FunctionQueue,
    AutoQueue,
    AsyncQueue,
} = require('axoncore');

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

            this.sendMessage(msg.channel, {
                embed: {
                    color: this.utils.color.green,
                    description: `${this.utils.emote.success} Updating ${this.bot.user.username}.`
                }
            })

            exec('git pull origin develop'), (error, stdout) => {
                const outputType = error || stdout;
                var output = outputType;
                if (typeof outputType === 'object') {
                    output = inspect(outputType, {
                        depth: getMaxDepth(outputType, args.join(' '))
                    });
                }
            }

            exec('pm2 restart 0'), (error, stdout) => {
                const outputType = error || stdout;
                var output = outputType;
                if (typeof outputType === 'object') {
                    output = inspect(outputType, {
                        depth: getMaxDepth(outputType, args.join(' '))
                    });
                }
            }
        } catch (err) {
            this.sendError(msg.channel, `Something went wrong.`
        )}
    }
}

module.exports = Build;

