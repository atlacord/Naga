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
            description: 'Can you hack it in the Five-Seven-Six society?',
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

        this.permissions = new CommandPermissions(this, {
            custom: (msg) => (msg.channel.id === '1273986973450764363')
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
        return syllables[0] === 5 && syllables[1] === 7 && syllables[2] === 6;
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
        let data = JSON.parse(readFileSync('assets/haikus.json'));

        let ids = data.map((obj) => obj.id);
        let haikus = data.map((obj) => obj.haiku);

        if (ids.includes(msg.member.id)) {
            return msg.channel.createMessage({
                embed: {
                    color: this.utils.getColor('red'),
                    title: '<:sokkajuiced:397018948253777931> You\'ve already submitted a haiku!'
                }
            });
        }
        else if ((haikus.includes(args.join(' '))) || args.join(' ').includes('haiku')) {
            return msg.channel.createMessage({
                embed: {
                    color: this.utils.getColor('red'),
                    title: '<:sokkajuiced:397018948253777931> That haiku has already been submitted!'
                }
            });
        }

        let res = this.haiku(args.join(' '));
        if (res) {
            msg.channel.createMessage({ 
                embed: {
                    color: this.utils.getColor('green'),
                    title: '<:sokkathumbsup:893152378864402473> Haiku accepted! :)'
                }
            });
            // msg.member.addRole('724751859356794880', 'Sent a valid haiku');
            data.push({ id: msg.member.id, haiku: args.join(' ') });
            writeFileSync('assets/haikus.json', JSON.stringify(data, null, 3));
        } else {
            msg.channel.createMessage({
                embed: {
                    color: this.utils.getColor('red'),
                    title: '<:sokkasad:725833135757197417> That was not a Sokka haiku! :('
                }
            });
        }
    }
}


module.exports = Haiku;

