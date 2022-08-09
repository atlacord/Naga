const { Command, CommandOptions } = require('axoncore');

class PlayLogo extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'logoquiz';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'logoquiz',
            description: 'Test your knowledge of company logos!',
            usage: 'logoquiz',
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
        this.axon.commandRegistry.get('game').subCommands.get('logoquiz').execute({msg});
    }
}

module.exports = PlayLogo;