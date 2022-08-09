const { Command, CommandOptions } = require('axoncore');
const { createCanvas, registerFont } = require('canvas');
const _ = require('lodash');
const profile = require('../../../Models/Profile');
registerFont('src/assets/captcha.ttf', { family: 'Captcha'});

class Captcha extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'captcha';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'game captcha',
            description: 'Play captcha',
            usage: 'game captcha',
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

    async executeCaptcha(msg, captchaCount, length, baseCredits, hasNotEnded) {
        const char = String.fromCharCode(...Array(123).keys()).replace(/\W/g, '');
        const code = (length) => _.sampleSize(char, length).join('');

            const canvas = createCanvas(150,50);
            const ctx = canvas.getContext('2d');
            const codeText = code(length);

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(canvas.width, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fillStyle = '#27292b';
            ctx.fill();
        
            ctx.textAlign = 'center';
            ctx.font = 'bold 20px Captcha';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillText(codeText, 75, 35, 140);
        
            const prompt = `**${msg.author.mention}**, Solve the following captcha under 30 seconds:`

            msg.channel.createMessage(prompt);
            this.sendMessage(msg.channel, {
                file: {
                    file: canvas.toBuffer(),
                    name: 'captcha.png'
                }
            });

            const filter = (message => message.author === msg.author);
            const options = { filter: filter, count: 1, timeout: 30000 };
            await msg.channel.awaitMessages(options).then(collection => {

                const content = collection.collected.random().content;

                if (content === codeText) {
                    captchaCount += 1;
                    this.sendSuccess(msg.channel, `You answered the captcha correctly! Added **100 credits!** (Current streak: ${captchaCount}`);
                    baseCredits += 100;
                    length += 1;
                    return;
                } else {
                    hasNotEnded = false;
                    return this.sendError(msg.channel, 'You entered the wrong code!'), hasNotEnded;
                };
            });

            return [hasNotEnded, baseCredits, captchaCount, length];
    }
    
    async execute({ msg }) {
        profile.findById(msg.author.id, async (err, doc) => {
            let baseCredits = 100;
            let captchaCount = 0;
            let hasNotEnded = true;
            let length = 5;

            msg.channel.createMessage([
                'Solve the succeeding captcha in under 30 seconds:',
                '- First question grants you 300 credits',
                '- Solving succeeding captchas earns 100 credits',
                '- Captchas are case sensitive',
                '- Succeeding captchas becomes longer the more you solve them.',
                '- Game begins in 5 seconds...'
            ].join('\n'));

            await new Promise(resolve => setTimeout(() => { resolve()}, 5000));

            while (hasNotEnded === true) {
                let func = await this.executeCaptcha(msg, captchaCount, length, baseCredits, hasNotEnded);
                hasNotEnded = func[0];
                baseCredits = func[1];
                captchaCount = func[2];
                length = func[3];
            }

            let win = baseCredits > 200, overflow = false, excess = null;

            if (doc.data.economy.wallet + baseCredits > 50000) {
                overflow = true;
                excess = doc.data.economy.wallet + baseCredits - 50000
            } else {
                doc.data.economy.wallet += baseCredits;
            };

            return doc.save().then(() => {
                if (!win) {
                    return this.sendError(msg.channel, 'You lost on your first attempt. You received 200 credits for trying!');
                } else {
                    return this.sendSuccess(msg.channel, `Congratulations! You received **${baseCredits}** credits for solving **${captchaCount}** captchas!`)
                }
            })
        })
    }
}

module.exports = Captcha;

