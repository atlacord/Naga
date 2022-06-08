const { Command, CommandOptions } = require('axoncore');
const moment = require('moment');
const profile = require('../../../Models/Profile');

class Daily extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'daily';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'daily',
            description: 'Get a daily reward!',
            usage: 'daily',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 5000,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg }) {
        profile.findById(msg.author.id, (err, doc) => {

            if (err) {
                return this.sendError(msg.channel, `Database error: ${err.message}`)
            } else if (!doc || doc.data.economy.wallet === null) {
                msg.channel.sendError(msg.channel, `**${msg.member.nick}**, you don't have a wallet yet! To create one, type \`${this.axon.settings.prefixes}register\`!`);
            } else {
                const now = Date.now();
                const baseAmount = 500;
                const previousStreak = doc.data.economy.streak.current;
                let overflow = false, excess = null, streakReset = false;

                if (doc.data.economy.streak.timestamp !== 0 && doc.data.economy.streak.timestamp - now > 0) {
                    msg.channel.createMessage(`**${msg.member.nick}**, you already got your daily reward!\nYou can get your next reward in ${moment.duration(doc.data.economy.streak.timestamp - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}`);
                };

                if ((doc.data.economy.streak.timestamp + 86400000) < now) {
                    doc.data.economy.streak.current = 0;
                    streakReset = true;
                };

                if (!streakReset) {
                    doc.data.economy.streak.current += 1;
                };

                if (doc.data.economy.streak.alltime < doc.data.economy.streak.current) {
                    doc.data.economy.streak.alltime = doc.data.economy.streak.current;
                };

                doc.data.economy.streak.timestamp = now + 72000000;
                const amount = baseAmount + 20 * (doc.data.economy.streak.current < 25 ? doc.data.economy.streak.current : 25);

                if (doc.data.economy.wallet + amount > 50000) {
                    overflow = true;
                    excess = doc.data.economy.wallet + amount - 50000;
                };

                const bonus = booster ? amount * 0.2 : 0;
                doc.data.economy.wallet = overflow ? 50000 : doc.data.economy.wallet + amount + bonus;

                return doc.save().then(() => msg.channel.createMessage([
                    `**${msg.member.nick}**, you got your **${text.commatize(amount)}** daily reward!`,
                    overflow ? `\n\\**Overflow Warning**: Your wallet just overflowed! You need to transfer some of your credits to your bank!` : '',
                    streakreset ? `\n**Streak Lost**: You haven't got your succeeding daily reward. Your streak is reset (x1).` : `\n**Streak x${doc.data.economy.streak.current}**`,
                    booster ? `\n\n**Hey!** Thanks for being a booster! You recieved ` + bonus + ` bonus credits!` : `\n\n**Psssst!** Server boosters get extra rewards!`,
                ].join(''))).catch(() => this.sendError(msg.channel, 'Unable to save the document to the database, please try again later.'));
            }   
        })
    }
}

module.exports = Daily;

