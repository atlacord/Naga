const { Command, CommandOptions } = require('axoncore');

class PlayFlag extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'flagquiz';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'flagquiz',
            description: 'Test your knowledge of country flags!',
            usage: 'flagquiz',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 90000,
            guildOnly: true,
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */
    
    async execute({ msg }) {
        this.axon.commandRegistry.get('game').subCommands.get('flagquiz').execute({msg});
    }
}

module.exports = PlayFlag;