const { Command, CommandOptions } = require('axoncore');
const { createCanvas, registerFont } = require('canvas');
const { Message } = require('discord.js');
registerFont('../../../assets/captcha.tt', { family: 'Captcha'});

class Captcha extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'captcha';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'captcha',
            description: 'Play captcha',
            usage: 'captcha',
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
    
    async execute({ msg }) {
        profile.findById(msg.author.id, (err, doc) => {
            const char = String.fromCharCode(...Array(123).keys()).replace(/\W/g, '');
            const code = (length) => _.sampleSize(char, length).join('');
            let length = 5;
            let hasNotEnded = true;
            let baseCredits = 100;
            let captchaCount = 0;

            await msg.channel.createMessage([
                'Solve the succeeding captcha in under 30 seconds:',
                '- First question grants you 300 credits',
                '- Solving succeeding captchas earns 100 credits',
                '- Captchas are case sensitive',
                '- Succeeding captchas becomes longer the more you solve them.',
                '- Game begins in 5 seconds...'
            ].join('\n'));

            const canvas = createCamvas(150,50);
            const ctx = canvas.getCanvas('2d');
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
            ctx.fillText(codetext, 75, 35, 140);
        
            const attachment = canvas.toBuffer();
            const name = 'captcha.png';
            const files = [ { attachment, name }];
            const prompt = `**${msg.author.mention}**, Solve the following captcha under 30 seconds:`

            await msg.channel.createMessage(prompt, { files });

            const filter = _msg => msg.author.id === _msg.author.id;
            const options = { max: 1, time: 30000, errors: ['time'] };
            const response = await Message.channel.awaitMessages(filter, options).then(collected => {
                const content = collected.first().content;
                if (content === codeText) {
                    captchaCount += 1;
                    baseCredits += 100;
                    return {};
                } else {
                    hasNotEnded = false;
                    return this.sendError(msg.channel, 'You entered the wrong code!');
                };
            });

            await this.sendSuccess(msg.channel, 'You answered the captcha correctly! Added 100 creditss!');
            length += 1;

            while (hasNotEnded) {

            let win = baseCredits > 200, overflow = false, excess = null;

            if (doc.data.economy.wallet + baseCredits > 50000) {
                overflow = true;
                excess = doc.data.economy.wallet + baseCredits - 50000
            } else {
                doc.data.economy.wallet += baseCredits;
            };

            return doc.save().then(() => {
                if (!win) {
                    return msg.channel.createMessage('egg');
                }
            })
        }
    })
}
}

module.exports = Captcha;

