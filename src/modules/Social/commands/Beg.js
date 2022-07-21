const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class Beg extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'beg';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'beg',
            description: 'Want to earn money some more coins? Why don\'t you try begging, maybe someone will give you some.',
            usage: 'beg',
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
            if (err) {
                return this.sendError(msg.channel, `DB Error: ${err}`);
            } else if (!doc || doc.data.economy.wallet === null) {
                return this.sendError(msg.channel, `You don't have a wallet yet! To create one, run \`${this.axon.settings.prefixes}register.`);
            } else {
                const now = Date.now();
                const duration = 3.6e+6;
                const userProfile = doc.data.economy.beg;
                let overflow = false, excess = null;

                if (userProfile.date > now) {
                    return this.sendError(msg.channel, `You have already been given some coins earlier! Please try again later.`);
                };

                userProfile.date = Date.now() + duration;
                const amount = Math.floor(Math.random() * 200) + 100;

                if (doc.data.economy.wallet + amount > 50000) {
                    overflow = true;
                    excess = doc.data.economy.wallet + amount - 50000
                };

                doc.data.economy.wallet = overflow ? 50000 : doc.data.economy.wallet + amount;

                return doc.save().then(() => msg.channel.createMessage(
                {
                    allowedMentions: {
                        repliedUser: true
                    },
                    messageReference: {
                        guildID: msg.channel.guild.id,
                        channelID: msg.channel.id,
                        messageID: msg.id
                    },
                    embed: {
                        color: this.utils.color.blue,
                        description: [`${this.utils.emote.success} You received **${amount}** from me.`, overflow ? `**Overflow warning**! Please deposit some of your account to your bank. You only received ${amount - excess} for this one!` : '',].join('')
                    }
                }))
                .catch((err) => this.utils.logError(msg, err, 'db', 'Something went wrong.'));
            }
        })
    }
}

module.exports = Beg;