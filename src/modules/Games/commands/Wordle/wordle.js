const { Command, CommandOptions } = require('axoncore');

const wordleguess = require('./WordleGuess')
const wordleplay = require('./WordlePlay')
const wordlestats = require('./WordleStats')

class Wordle extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'wordle';
        this.aliases = [
            'wd',
        ];

        this.hasSubcmd = true;

        this.info = {
            name: 'wordle',
            description: 'Play some wordle!',
            usage: 'wordle <play>/<stats>/<guess>',
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

     init() {
        return [wordleguess, wordleplay, wordlestats]
    }

    execute( { msg } ) {
        try {
            this.sendMessage(msg.channel, `Run \`${this.axon.settings.prefixes}wordle play\`,  \`${this.axon.settings.prefixes}wordle guess\` or \`${this.axon.settings.prefixes}wordle stats\`!`);
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Wordle;