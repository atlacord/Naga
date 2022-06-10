const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class Withdraw extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'withdraw';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'withdraw',
            description: 'Withdraw money from your bank account!',
            usage: 'withdraw [amount]',
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
                    amount = Math.floor(doc.data.economy.bank);
                } else {
                    amount = Math.round(amount?.split(',').join('')) / 0.95;
                };

                if (amount < 100) {
                    return this.sendError(msg.channel, 'You must withdraw at least **100** credits!');
                } 

                else if (amount > doc.data.economy.bank) {
                    return this.sendError(msg.channel, `You don't have enough credits to proceed with this transaction! You only have ${this.utils.commatize$amount - doc.data.economy.withdraw + Math.ceil(amount * 0.05)})** less than the amount you need to withdraw (5% fee included)\nTo withdraw all credits, run \`${this.axon.settings.prefixes}withdraw all\`.`)
                };

                doc.data.economy.bank = Math.round(doc.data.economy.bank - amount);
                doc.data.economy.wallet = doc.data.economy.wallet - Math.round(amount * 1.05);

                return doc.save().then(() => this.sendSuccess(msg.channel, `You successfully withdrew **${this.utils.commatize(amount * 0.95)}** credits from your bank! (+5% fee)`))
                .catch((err) => this.sendError(msg.channel, `Unable to process transaction: ${err}`));
            }
        })
    }
}

module.exports = Withdraw;