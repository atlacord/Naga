const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const syllable = require('syllabificate');

class Haiku extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'haiku';

        this.hasSubcmd = false;

        this.info = {
            name: 'haiku',
            description: 'Provides a random topic about ATLA!',
            usage: 'haiku',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
            guildOnly: true,
        });

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    haiku(str) {
        const lines = this.parseLines(str);
      
        if (lines.length !== 3) {
          return false;
        }
      
        const syllables = this.lookupSyllables(lines);
      
        // 5 7 5
        return syllables[0] === 5 && syllables[1] === 7 && syllables[2] === 5;
    }

    lookupSyllables (lines) {
        return lines.map(function (line) {
            let syllables = syllable.countSyllables(line);
            return syllables;
        });
    }

    parseLines (str) {
        return str
          .trim()
          .toLowerCase()
          .split(/[\n\r]+/);
    }

    async execute({ msg, args }) {
        let res = this.haiku(args.join(' '));
        if (res === true) {
            msg.channel.createMessage('That was a haiku!')
        } else {
            msg.channel.createMessage('That was not a haiku :(');
        }
    }
}


module.exports = Haiku;

