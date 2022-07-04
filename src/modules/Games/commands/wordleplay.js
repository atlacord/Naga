const { Command, CommandOptions } = require('axoncore');
const WordleFunc = require(`../../../../Util/wordlefunctions`)
class WordlePlay extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'play';
        this.aliases = [ 'play' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'wordle play',
            description: 'Play a new wordle game!',
            usage: 'wordle play',
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
        WordleFunc.LoadNewWordle(msg)
    }
}


module.exports = WordlePlay;

