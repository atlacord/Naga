const { Command, CommandOptions } = require('axoncore');
const Captcha = require('./Captcha/Captcha');
const FlagQuiz = require('./FlagQuiz/FlagQuiz');
// const Hangman = require('./Hangman');
const LogoQuiz = require('./LogoQuiz/LogoQuiz');
const TypingQuiz = require('./TypingQuiz/TypingQuiz');

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
        return [Captcha, FlagQuiz, LogoQuiz, TypingQuiz];
    }
    
    async execute({ msg }) {
        this.sendMessage(msg.channel, { embed: {
            color: this.utils.color.blue,
            description: `Run \`${this.axon.settings.prefixes}game [game]\` to play a game!`
        }})
    }
}

module.exports = Game;

