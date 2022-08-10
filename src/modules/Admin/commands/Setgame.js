const { Command, CommandPermissions, CommandOptions } = require('axoncore');

class SetGame extends Command {
    constructor(module) {
        super(module);

        this.label = 'setgame';
        this.aliases = [
            'setstatus'
        ];

        this.info = {
            name: 'setgame',
            description: 'Changes status',
            usage: 'setgame [type] [status]',
        };
// If you're reading this you are a nerd lol
      /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
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
            client.editStatus({
                game: {
                    type: args[0],
                    name: args.slice(1).join(' ')
                }
            })
            this.sendSuccess(msg.channel, `Status updated.`);
        } catch(e) {
            this.logger.error(e)
        }
    }
}

module.exports = SetGame;