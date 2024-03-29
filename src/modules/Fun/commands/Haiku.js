const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const syllable = require('syllable');
// const haikus = require('../../../assets/haikus.json');
const { readFileSync, writeFileSync } = require('fs');

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
            description: 'Can you hack it in the Five-Seven-Five society?',
            usage: 'haiku [your haiku here]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 10000,
            guildOnly: true,
        });

        // this.permissions = new CommandPermissions(this, {
        //     staff: {
        //         needed: this.axon.staff.dailis,
        //         bypass: this.axon.staff.owners,
        //     },
        //     custom: (msg) => (!msg.member.roles.includes('724751859356794880'))
        // });
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
            let syllables = syllable(line);
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
        let data = readFileSync('src/assets/haikus.json');
        let haikus = JSON.parse(data);
        if ((haikus.includes(args.join(' '))) || args.join(' ').includes('haiku')) {
            return msg.channel.createMessage('Give me something more original!');
        }
        let res = this.haiku(args.join(' '));
        if (res === true) {
            msg.channel.createMessage('What a Remarkable Oaf!');
            msg.member.addRole('724751859356794880', 'Sent a valid haiku');
            haikus.push(args.join(' '));
            writeFileSync('src/assets/haikus.json', JSON.stringify(haikus));
        } else {
            msg.channel.createMessage('That was not a haiku :(');
        }
    }
}


module.exports = Haiku;

