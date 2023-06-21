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

            let displayName = msg.member.nick ?? msg.author.username;

            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            } else if (!doc || doc.data.economy.wallet === null) {
                return msg.channel.sendError(msg.channel, `**${displayName}**, you don't have a wallet yet! To create one, type \`${this.axon.settings.prefixes}register\`!`);
            } else {

                const boostID = '586128911302131725';
                const booster = msg.member.roles.includes(boostID);

                const now = Date.now();
                const baseAmount = 500;

                let streakReset = false;

                if (doc.data.economy.streak.timestamp !== 0 && doc.data.economy.streak.timestamp - now > 0) {
                    return msg.channel.createMessage(msg.channel.createMessage({
                        allowedMentions: {
                            repliedUser: false
                        }, 
                        embed: {
                            color: this.utils.getColor('red'),
                            description: `${this.utils.emote.error} You already got your daily reward!\nYou can get your next reward in ${moment.duration(doc.data.economy.streak.timestamp - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}`
                        },
                        messageReference: {
                            guildID: msg.channel.guild.id,
                            channelID: msg.channel.id,
                            messageID: msg.id
                        }
                    }))
                };

                if ((doc.data.economy.streak.timestamp * (48 * 3600000)) < now) {
                    doc.data.economy.streak.current = 0;
                    // streakReset = true;
                };

                if (!streakReset) {
                    doc.data.economy.streak.current += 1;
                };

                if (doc.data.economy.streak.alltime < doc.data.economy.streak.current) {
                    doc.data.economy.streak.alltime = doc.data.economy.streak.current;
                };

                doc.data.economy.streak.timestamp = now + 72000000;
                const amount = baseAmount + 20 * (doc.data.economy.streak.current < 25 ? doc.data.economy.streak.current : 25);

                const bonus = booster ? amount * 0.2 : 0;
                doc.data.economy.wallet = doc.data.economy.wallet + amount + bonus;

                return doc.save().then(() => msg.channel.createMessage({
                    allowedMentions: {
                        repliedUser: false
                    }, 
                    embed: {
                        color: this.utils.getColor('blue'),
                        description: [
                            `You got your **${this.utils.commatize(amount)}** daily reward!`,
                            streakReset ? `\n**Streak Lost**: You haven't got your succeeding daily reward. Your streak is reset (x1).` : `\n**Streak x${doc.data.economy.streak.current}**`,
                            booster ? `\n\n**Hey!** Thanks for being a booster! You recieved ` + bonus + ` bonus credits!` : `\n\n**Psssst!** Server boosters get extra rewards!`,
                        ].join('')
                    },
                    messageReference: {
                        guildID: msg.channel.guild.id,
                        channelID: msg.channel.id,
                        messageID: msg.id
                    }
                })).catch((err) => this.utils.logError(msg, err, 'db', 'Something went wrong.'));
            }   
        })
    }
}

module.exports = Daily;

