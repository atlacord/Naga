const { Command, CommandOptions } = require('axoncore');
const { createCanvas, registerFont } = require('canvas');
const _ = require('lodash');
const topic = require('../../../assets/typingtopics.json');
const profile = require('../../../Models/Profile');
registerFont('src/assets/handwriting.ttf', { family: 'Handwriting'});

class TypingQuiz extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'typingquiz';
        this.aliases = [
            'typing'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'game typingquiz',
            description: 'Test your typing accuracy!',
            usage: 'game typingquiz',
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

    async execute({ msg }) {
        profile.findById(msg.author.id, async (err, doc) => {
            let quote = Math.floor(Math.random() * topic.length);
            quote = topic[quote];
            let failed = false;
            let reason = null;

            const array = quote.split(/ +/);
            const description = _.chunk(array, 6);
            const canvas = createCanvas(300, description.length * 25 + 10);
            const ctx = canvas.getContext('2d');

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(canvas.width, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fillStyle = '#27292b';
            ctx.fill();

            ctx.textAlign = 'center';
            ctx.font = '20px Handwriting';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';

            description.forEach((item, i) => {
                ctx.fillText(item.join(' '), canvas.width / 2, 25 * (i + 1), canvas.width - 10);
            });

            const prompt = `**${msg.author.mention}**, type the following sentence/paragraph in under 45 seconds:`;

            await this.sendMessage(msg.channel, prompt);
            await this.sendMessage(msg.channel, { file: { file: canvas.toBuffer(), name: 'typequiz.png' }});

            const filter = (message => message.author === msg.author);
            const options = { filter: filter, count: 1, timeout: 50000 };
            await msg.channel.awaitMessages(options).then(collection => {

                const content = collection.collected.random().content.toLowerCase();
                if (content === quote.toLowerCase()) {
                    return;
                } else {
                    failed = true;
                    reason = 'You didn\'t type the sentence/paragraph correctly!';
                    return;
                }
            }).catch(() => {
                failed = true;
                reason = 'You ran out of time!';
            });

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
                    return this.sendError(msg.channel, `${reason} you received **${amount}** credits for trying!`, 
                    overflow ? `Overflow warning! Please deposit some of your wallet to your bank. You only received ${amount - excess} for this one!` : '');
                } else {
                    return this.sendSuccess(msg.channel, `Congratulations! You received **${amount}** credits for typing the sentence/paragraph correctly!`, 
                    overflow ? `Overflow warning! Please deposit some of your wallet to your bank. You only received ${amount - excess} for this one!` : '');
                }
            })
        })
    }
}

module.exports = TypingQuiz;

