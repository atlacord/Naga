const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');
const attachment = `${process.cwd()}/assets/images/30-sec-timer.gif`;
const gameword = require('../../../assets/hangman.json');
const hangs = [
   '/---|\n|\n|\n|\n|',
   '/---|\n|   o\n|\n|\n|',
   '/---|\n|   o\n|   |\n|\n|',
   '/---|\n|   o\n|  /|\n|\n|',
   '/---|\n|   o\n|  /|\\\n|\n|',
   '/---|\n|   o\n|  /|\\\n|  /\n|',
   '/---|\n|   o ~ GAME OVER!\n|  /|\\\n|  / \\\n|'
];

class Hangman extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'hangman';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'game hangman',
            description: 'Play hangman!',
            usage: 'game hangman',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 60000,
            guildOnly: true,
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

     async executeHangman(msg, phrase, stage, incguess, corguess, hasEnded) {

        do {
          const randomWord = Math.floor(Math.random() * gameword.length);
          phrase = gameword[randomWord].toUpperCase();
        } while (phrase.length <= 8 || phrase.length >= 16 );

        let word = phrase.replace(/\w/ig,'_')

        const embed = {
            color: this.utils.color.blue,
            author: { name: 'Hangman' },
            description: 'Guess the word! (Avatar universe)',
            fields: [
                { name: 'Player', value: `\`\`\`properties\n${hangs[stage]}\n\`\`\``, inline: false },
                {
                  name: `${msg.author.username}#${msg.author.discriminator}`, inline: true,
                  value: [
                    `Word: \`${word.split('').join(' ')}\``,
                    `Guesses: \`${corguess.join(',') || '\u200b'}\``,
                    `Misses: \`${incguess.join(',') || '\u200b'}\``,
                    `Tries Remaining: **${hangs.length - (stage + 1)}**`
                  ].join('\n')
                }
            ]
        }
      
        const reveal = (char) => {
          phrase.split('').forEach((letter, index) => {
            if (char === letter) {
              const arr = word.split('');
              arr[index] = char;
              word = arr.join('');
            } else {
              // Do nothing...
            };
          });
          return;
        };
        console.log(phrase);
        await msg.channel.createMessage({embed});

        const filter = (message => (message.author === msg.author) && (msg.content.length === 1));
        const options = { filter: filter, count: 1, timeout: 30000 };
        await msg.channel.awaitMessages(options).then(collection => {
          const content = collection.collected.random().content;
            if (phrase.includes(content)){
              corguess.push(content)
              reveal(content);
              return;
            } else {
              incguess.push(content)
              stage += 1;
              return;
            };
        })
        .catch(() => {
          incguess.push('⌛');
          stage += 1;
          return;
        });
    
        if (word === phrase || stage === hangs.length - 1){
          hasEnded = true;
        };
        return Promise.resolve([stage, incguess, corguess, hasEnded]);
    };

    async execute({ msg }) {
        profile.findById(msg.author.id, async (err, doc) => {
            let phrase = '';
            let stage = 0, incguess = [], corguess = [], hasEnded = false
            let reason = null;

            while (hasEnded === false) {
                let func = await this.executeHangman(msg, phrase, stage, incguess, corguess);
                stage = func[0];
                incguess = func[1];
                corguess = func[2];
                hasEnded = func[3];
            }

            let win = reason === null, overflow = false, excess = null;
            const amount = win ? 500 : 100;

            if (doc.data.economy.wallet + amount > 50000) {
                overflow = true;
                excess = doc.data.economy.wallet + amount - 50000;
                doc.data.economy.wallet = 50000;
            } else {
                doc.data.economy.wallet += amount;
            };

            return doc.save().then(() => {
                if (!win) {
                    return this.sendError(msg.channel, `${reason}. You received **${amount}** credits for trying!`, 
                    overflow ? `Overflow warning! Please deposit some of your wallet to your bank. You only received ${amount - excess} for this one!` : '');
                } else {
                    return this.sendSuccess(msg.channel, `Congratulations! You received **${amount}** credits for guessing the word correctly!`, 
                    overflow ? `Overflow warning! Please deposit some of your wallet to your bank. You only received ${amount - excess} for this one!` : '');
                }
            })
        })
    }
}

module.exports = Hangman;

