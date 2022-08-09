const { Command, CommandOptions } = require('axoncore');
const flags = Object.entries(require('../../../../assets/flags.json'));
const profile = require('../../../../Models/Profile');

class FlagQuiz extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'flagquiz';
        this.aliases = [
            'flags'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'game flagquiz',
            description: 'Test your flag knowledge!',
            usage: 'game flagquiz',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 90000,
            guildOnly: true,
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

     async executeQuiz(msg, attempts, baseCredits, hasNotEnded, reason) {

        let [code, country] = flags[Math.floor(Math.random() * flags.length)];
        country = country.split(',')[0];

        const prompt = `**${msg.author.mention}**, guess the country by this flag under 30 seconds:`
        const flag = `https://raw.githubusercontent.com/hampusborgos/country-flags/main/png1000px/${code.toLowerCase()}.png`;

        await this.sendMessage(msg.channel, `${prompt}`);
        await this.sendMessage(msg.channel, flag);

        const filter = (message => message.author === msg.author);
        const options = { filter: filter, count: 1, timeout: 30000 };
        await msg.channel.awaitMessages(options).then(collection => {

            const content = collection.collected.random().content.toLowerCase();
            if (content.toLowerCase() === country.toLowerCase()) {
                this.sendSuccess(msg.channel, 'Correct! **+100** Credits')
                attempts += 1;
                baseCredits += 100;
                return;
            } else {
                hasNotEnded = false;
                reason = `Wrong country! The correct answer was **${country}**`;
                return;
            }
        }).catch(() => {
            hasNotEnded = false;
            reason = `You ran out of time! The correct answer was **${country}**`;
        });

            return [hasNotEnded, baseCredits, attempts, reason];
    }

    async execute({ msg }) {
        profile.findById(msg.author.id, async (err, doc) => {

            let hasNotEnded = true, attempts = 0, baseCredits = 200;
            let reason = null;

            await msg.channel.createMessage([
                'Guess the succeeding country by its flag in under 30 seconds:',
                '- First question grants you 300 credits',
                '- Answering succeeding flags earns 100 credits',
                '- You only have 1 attempt per question',
                '- Game begins in 5 seconds...'
            ].join('\n'))

            await new Promise(resolve => setTimeout(() => { resolve()}, 5000));

            while (hasNotEnded === true) {
                let func = await this.executeQuiz(msg, attempts, baseCredits, hasNotEnded, reason);
                hasNotEnded = func[0];
                baseCredits = func[1];
                attempts = func[2];
                reason = func[3];
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
                    return this.sendSuccess(msg.channel, `Congratulations! You received **${amount}** credits for guessing the country correctly!`, 
                    overflow ? `Overflow warning! Please deposit some of your wallet to your bank. You only received ${amount - excess} for this one!` : '');
                }
            })
        })
    }
}

module.exports = FlagQuiz;

