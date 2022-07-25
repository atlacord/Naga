const { Command, CommandOptions } = require('axoncore');

class PlayTyping extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'typingquiz';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'typingquiz',
            description: 'Test your typing accuracy!',
            usage: 'typingquiz',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 60000,
            guildOnly: true,
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */
    
    async execute({ msg }) {
        this.axon.commandRegistry.get('game').subCommands.get('typingquiz').execute({msg});
    }
}

module.exports = PlayTyping;