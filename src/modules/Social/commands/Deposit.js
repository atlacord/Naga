const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class Deposit extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'deposit';
        this.aliases = [
            'dep'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'deposit',
            description: 'Deposit money into your bank account!',
            usage: 'deposit [amount]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 10000,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {

        // let bankTax = 0.95;
        // let actualTax = 0.05;

        profile.findById(msg.author.id, (err, doc) => {
            if (err) {
                return this.sendError(msg.channel, `DB Error: ${err}`);

            } else if (!doc || doc.data.economy.wallet === null) {
                return this.sendError(msg.channel, `You don't have a wallet yet! To create one, run \`${this.axon.settings.prefixes}register.`);

            } else if (doc.data.economy.bank === null) {
                return this.sendError(msg.channel, `You don't have a bank account yet! To create one, run \`${this.axon.settings.prefixes}bank.`);

            } else {
                let amount = args[0];

                if (amount?.toLowerCase() === 'all') {
                    amount = Math.floor(doc.data.economy.wallet);
                } else {
                    amount = Math.round(amount?.split(',').join(''));
                };

                if (amount < 100) {
                    return this.sendError(msg.channel, 'You must deposit at least **100** credits!');
                } 

                else if (amount > doc.data.economy.wallet) {
                    return this.sendError(msg.channel, `You don't have enough credits to proceed with this transaction! You only have ${this.utils.commatize$amount - doc.data.economy.wallet + Math.ceil(amount)})** less than the amount you need to deposit.\nTo deposit all credits, run \`${this.axon.settings.prefixes}deposit all\`.`)
                };

                doc.data.economy.bank = doc.data.economy.bank + amount;
                doc.data.economy.wallet = doc.data.economy.wallet - Math.floor(amount);

                return doc.save().then(() => msg.channel.createMessage({
                    allowedMentions: {
                        repliedUser: false
                    }, 
                    embed: {
                        color: this.utils.getColor('green'),
                        description: `${this.utils.emote.success} You successfully deposited **${this.utils.commatize(amount)}** credits to your bank!`
                    },
                    messageReference: {
                        guildID: msg.channel.guild.id,
                        channelID: msg.channel.id,
                        messageID: msg.id
                    }
                }))
                .catch((err) => this.utils.logError(msg, err, 'db', 'Unable to process transaction.'));
            }
        })
    }
}

module.exports = Deposit;