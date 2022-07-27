const { Command, CommandOptions } = require('axoncore');
const { createCanvas, loadImage } = require('canvas');
const logos = require('../../../assets/logoquiz.json');
const profile = require('../../../Models/Profile');

class LogoQuiz extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'logoquiz';
        this.aliases = [
            'logos'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'game logoquiz',
            description: 'Test your logo knowledge!',
            usage: 'game logoquiz',
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

    async execute({ msg }) {
        profile.findById(msg.author.id, async (err, doc) => {

            const meta =  logos[Math.floor(Math.random() * logos.length)];

            const canvas = createCanvas(396, 264);
            const ctx = canvas.getContext('2d');
            const logo = await loadImage(meta.url);

            let failed = false;
            let reason = null;

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(canvas.width, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fillStyle = '#27292b';
            ctx.fill();
          
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 20;
          
            ctx.drawImage(logo, 0, 0, 396, 264);

            const prompt = `**${msg.author.mention}**, guess the logo under 30 seconds:`;
            const clue = meta.name.replace(/\w/ig,'_').split('').join(' ');

            await this.sendMessage(msg.channel, `${prompt}\n\`${clue}\``);
            await this.sendMessage(msg.channel, { file: { file: canvas.toBuffer(), name: 'logoquiz.png' }});

            const filter = (message => message.author === msg.author);
            const options = { filter: filter, count: 1, timeout: 30000 };
            await msg.channel.awaitMessages(options).then(collection => {

                const content = collection.collected.random().content.toLowerCase();
                if (content === meta.name.toLowerCase()) {
                    return;
                } else {
                    failed = true;
                    reason = `You didn\'t guess the logo correctly! The correct answer was **${meta.name}**`;
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
                    return this.sendSuccess(msg.channel, `Congratulations! You received **${amount}** credits for guessing the logo correctly!`, 
                    overflow ? `Overflow warning! Please deposit some of your wallet to your bank. You only received ${amount - excess} for this one!` : '');
                }
            })
        })
    }
}

module.exports = LogoQuiz;

