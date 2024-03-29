const { Command, CommandOptions, CommandResponse } = require('axoncore');

class Ping extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'ping';
        this.aliases = [
            'pong',
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'ping',
            description: 'Ping the bot.',
            usage: 'ping',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: true,
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */
    async execute( { msg } ) {
        const start = Date.now();
        const mess = await this.sendMessage(msg.channel, 'Pong! ');
        if (!mess) {
            return new CommandResponse( { success: false } );
        }

        const diff = (Date.now() - start);
        this.editMessage(mess, `Pong! \`${diff}ms\``);

        return new CommandResponse( { success: true } );
    }
}

module.exports = Ping;
