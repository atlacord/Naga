const { Command, CommandOptions } = require('axoncore');
const Captcha = require('./Captcha');

class Game extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'game';
        this.aliases = [
        ];

        this.hasSubcmd = true;

        this.info = {
            name: 'game',
            description: 'Play a game',
            usage: 'game',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
            guildOnly: true,
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    init() {
        return [Captcha];
    }
    
    async execute({ msg }) {
        this.sendMessage(msg.channel, { embed: {
            color: this.utils.color.blue,
            description: `Run \`${this.axon.settings.prefixes}game [game]\` to play a game!`
        }})
    }
}

module.exports = Game;

