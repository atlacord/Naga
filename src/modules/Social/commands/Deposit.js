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

        let bankTax = 0.95;
        let actualTax = 0.05;

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
                    amount = Math.floor(doc.data.economy.wallet * bankTax);
                } else {
                    amount = Math.round(amount?.split(',').join(''));
                };

                if (amount < 100) {
                    return this.sendError(msg.channel, 'You must deposit at least **100** credits!');
                } 

                else if (amount * actualTax > doc.data.economy.wallet) {
                    return this.sendError(msg.channel, `You don't have enough credits to proceed with this transaction! You only have ${this.utils.commatize$amount - doc.data.economy.wallet + Math.ceil(amount * bankTax)})** less than the amount you need to deposit (${Math.ceil(bankTax * 100)}% fee included)\nTo deposit all credits, run \`${this.axon.settings.prefixes}deposit all\`.`)
                };

                doc.data.economy.bank = doc.data.economy.bank + amount;
                doc.data.economy.wallet = doc.data.economy.wallet - Math.floor(amount * 1.05);

                return doc.save().then(() => this.sendSuccess(msg.channel, `You successfully deposited **${this.utils.commatize(amount)}** credits to your bank! (+5% fee)`))
                .catch((err) => this.sendError(msg.channel, `Unable to process transaction: ${err}`));
            }
        })
    }
}

module.exports = Deposit;