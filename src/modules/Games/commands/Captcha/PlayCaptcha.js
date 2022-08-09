const { Command, CommandOptions } = require('axoncore');

class PlayCaptcha extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'captcha';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'captcha',
            description: 'Guess the captcha!',
            usage: 'captcha',
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
        this.axon.commandRegistry.get('game').subCommands.get('captcha').execute({msg});
    }
}

module.exports = PlayCaptcha;