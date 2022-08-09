const { Command, CommandOptions } = require('axoncore');
const WordleFunc = require(`../wordlefunctions`)

class WordleGuess extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'guess';
        this.aliases = [ 'guess' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'wordle guess',
            description: 'Guess a word!',
            usage: 'wordle guess',
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

     async execute( { msg } ) {
        WordleFunc.PlayWordle(msg)
    }
}


module.exports = WordleGuess;

