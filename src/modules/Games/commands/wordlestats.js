const { Command, CommandOptions } = require('axoncore');
const WordleFunc = require(`../../../../Util/wordlefunctions`)
class WordleStats extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'stats';
        this.aliases = [ 'stats' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'wordle stats',
            description: 'Get your wordle stats!',
            usage: 'wordle stats',
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
        WordleFunc.ShowWordleStats(msg)
    }
}


module.exports = WordleStats;

