const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class Balance extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'balance';
        this.aliases = [
            'bal',
            'wallet'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'balance',
            description: 'View your wallet balance!',
            usage: 'balance',
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
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            };

            if (!doc || doc.data.economy.wallet === null) {
                return this.sendError(msg.channel, `You don't have a wallet! To create one, run \`${this.axon.settings.prefixes}register\`.`);
            };

            return this.sendMessage(msg.channel, { 
                embed: {
                    author: { name: `${msg.author.username}\'s wallet` },
                    color: this.utils.getColor('blue'),
                    thumbnail: { url: msg.author.avatarURL },
                    description: `💰 **${this.utils.commatize(doc.data.economy.wallet)}** credits in posession.\n
                    ${doc.data.economy.bank !== null ? `💰 **${this.utils.commatize(doc.data.economy.bank)}** credits in bank!`
                    : `Seems like you don't have a bank yet. Create one now by typing \`${this.axon.settings.prefixes}bank\``
                    } \nDaily Streak: **${doc.data.economy.streak.current}** (All time best: **${doc.data.economy.streak.alltime}**)`
                }
            })
        })
    }
}

module.exports = Balance;

