const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class Find extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'find';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'find',
            description: 'You can find hidden credits in your surroundings if you try!',
            usage: 'find',
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
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            } else if (!doc || doc.data.economy.wallet === null) {
                return this.sendError(msg.channel, `You don't have a wallet yet! To create one, run \`${this.axon.settings.prefixes}register.`);
            } else {
                const now = Date.now();
                const duration = 3.6e+6;
                const userProfile = doc.data.economy.beg;
                let excess = null;

                if (userProfile.date > now) {
                    return msg.channel.createMessage({
                        allowedMentions: {
                            repliedUser: false
                        }, 
                        embed: {
                            color: this.utils.getColor('red'),
                            description: `${this.utils.emote.error} You tried searching for credits but found... nothing. Perhaps try again later?`
                        },
                        messageReference: {
                            guildID: msg.channel.guild.id,
                            channelID: msg.channel.id,
                            messageID: msg.id
                        }
                    })
                };

                userProfile.date = Date.now() + duration;
                const amount = Math.floor(Math.random() * 200) + 100;

                doc.data.economy.wallet = doc.data.economy.wallet + amount;

                return doc.save().then(() => msg.channel.createMessage({
                    allowedMentions: {
                        repliedUser: false
                    }, 
                    embed: {
                        color: this.utils.getColor('green'),
                        description: `${this.utils.emote.success} You found **${amount}**!`
                    },
                    messageReference: {
                        guildID: msg.channel.guild.id,
                        channelID: msg.channel.id,
                        messageID: msg.id
                    }
                }))
                .catch((err) => this.utils.logError(msg, err, 'db', 'Something went wrong.'));
            }
        })
    }
}

module.exports = Find;