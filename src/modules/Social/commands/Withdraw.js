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
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');

            } else if (!doc || doc.data.economy.wallet === null) {
                return this.sendError(msg.channel, `You don't have a wallet yet! To create one, run \`${this.axon.settings.prefixes}register.`);

            } else if (doc.data.economy.bank === null) {
                return this.sendError(msg.channel, `You don't have a bank account yet! To create one, run \`${this.axon.settings.prefixes}bank.`);

            } else {
                let amount = args[0];

                if (amount?.toLowerCase() === 'all') {
                    amount = Math.floor(doc.data.economy.bank);
                } else {
                    amount = Math.round(amount?.split(',').join(''));
                };

                if (amount < 100) {
                    return this.sendError(msg.channel, 'You must withdraw at least **100** credits!');
                } 

                else if (amount > doc.data.economy.bank) {
                    return this.sendError(msg.channel, `You don't have enough credits to proceed with this transaction! You only have ${this.utils.commatize$amount - doc.data.economy.withdraw + Math.ceil(amount)})** less than the amount you need to withdraw (5% fee included)\nTo withdraw all credits, run \`${this.axon.settings.prefixes}withdraw all\`.`)
                };

                doc.data.economy.bank = Math.round(doc.data.economy.bank - amount);
                doc.data.economy.wallet = doc.data.economy.wallet + amount;

                return doc.save().then(() => this.sendSuccess(msg.channel, `You successfully withdrew **${this.utils.commatize(amount)}** credits from your bank!`))
                .catch((err) => this.utils.logError(msg, err, 'db', 'Something went wrong.'));
            }
        })
    }
}

module.exports = Withdraw;