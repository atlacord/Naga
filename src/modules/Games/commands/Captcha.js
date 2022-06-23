const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');
const { createCanvas, registerFont } = require('canvas');
registerFont(`./src/assets/captcha.ttf`, { family: 'Captcha'});

class Captcha extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'captcha';
        this.aliases = [
        ];

        this.hasSubcmd = true;

        this.info = {
            name: 'game captcha',
            description: 'Play a game',
            usage: 'game captcha',
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
        profile.findById(msg.author.id, (err, doc) => {
            const char = String.fromCharCode(...Array(123).keys()).replace(/\W/g,'');
            const code = (length) => _.sampleSize(char, length).join('');
            let length = 5;
            let hasNotEnded = true;
            let basecredits = 100;
            let captchacount = 0;

            const now = Date.now();
            const duration = 1.8e+6;
            const collection = doc.data.economy.title || tdoc.data.economy.wallet.update(this.label);
            const userprofile = collection.get(message.author.id) || collection.set(message.author.id, { date: 0 }).get(message.author.id);
            const momentduration = momdur(userprofile.date - Date.now()).format('H [hours,] m [minutes, and] s [seconds]');

            this.sendMessage(msg.channel, [  
            'Solve the succeeding captcha in under 30 seconds:',
            '- First question grants you 300 credits',
            '- Solving succeeding captchas earns 100 credits',
            '- Captchas are case sensitive',
            '- Succeeding captchas becomes longer the more you solve them.',
            '- Game begins in 5 seconds...'
            ].join('\n'))

            // await new Promise(resolve => setTimeout(() => { resolve()}, 500));

            const canvas = createCanvas(150,50);
            const ctx = canvas.getContext('2d');
            const codeText = code(length);

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(canvas.width, 0)
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
            const prompt = `**${msg.author.username}**, Solve the following captcha under 30 seconds:`
        
            this.sendMessage(msg.channel, (prompt, { files }));
        
            const filter = _message => msg.author.id === _msg.author.id;
            const options = { max: 1, time: 30000, errors: ['time'] };
            const response = msg.channel.awaitMessages(filter, options)
            .then(collected => {
              const content = collected.first().content;
              if (content === codetext){
                captchacount++;
                basecredits += 100;
                return {};
              } else {
                hasNotEnded = false;
                return { err: 'INCORRECT_CODE' };
              };
            })
            .catch(() => {
              hasNotEnded = false;
              return { err: 'TIMEOUT' };
            });
        
            if (response.err) {
              const reason = {
                INCORRECT_CODE: 'You entered the wrong code!',
                TIMEOUT: 'You ran out of time!'
              };
              return this.sendError(msg.channel, reason[response.err]);
            };
        
            this.sendSuccess(msg.channel, 'You answered the captcha! Added 100 credits!');
            length += 1;
        
        while (hasNotEnded);
        
          let win = basecredits > 200, overflow = false, excess = null;;
        
          if (doc.data.economy.wallet + basecredits > 50000){
            overflow = true;
            excess = doc.data.economy.wallet + basecredits - 50000
            doc.data.economy.wallet = 50000;
          } else {
            doc.data.economy.wallet += basecredits;
          };
        
          return doc.save()
          .then(() => {
            if (!win){
              return this.sendError(msg.channel, [
                `You lost on your first attempt.`,
                'You received 200 credits for trying!',
                overflow ? `Overflow warning! Please deposit some of your account to your **bank**. You only received ${basecredits-excess} for this one!` :'',
              ].join('\n'));
            } else {
              return this.sendSuccess(msg.channel, [
                `Congratulations!`,
                `You received **${basecredits}** for solving ${captchacount} captcha(s)!`,
                overflow ? `Overflow warning! Please deposit some of your account to your **bank**. You only received ${basecredits-excess} for this one!` :'',
              ].join('\n'));
            }
          })
          .catch(() => this.sendError(msg.channel, `DB Error: ${err}`));
        });
    }
}

module.exports = Captcha;

