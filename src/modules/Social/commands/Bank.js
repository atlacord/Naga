const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class Bank extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'bank';
        this.aliases = [
            'createbank',
            'registerbank'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'bank',
            description: 'Create a bank account',
            usage: 'bank',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
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
            }

            else if (!doc || doc.data.economy.wallet === null) {
                return this.sendError(msg.channel, `You need coins to create a bank account! To create a wallet, run \`${this.axon.settings.prefixes}register\`.`);
            }

            else if (doc.data.economy.bank !== null) {
                return this.sendError(msg.channel, 'You already have a bank account.');
            }

            else if (doc.data.economy.wallet < 2500) {
                return this.sendError(msg.channel, `It seems like you don't have enough coins to create a bank account - **${this.utils.commatize(2500 - doc.data.economy.wallet)}** more coines are needed.`)  
            }
            
            else {
                doc.data.economy.wallet = doc.data.economy.wallet - 2500;
                doc.data.economy.bank = 2500;
            
                return doc.save().then(() => this.sendSuccess(msg.channel, `Successfully created a bank account! The **2,500** fee was transferred to your bank. To check your balance, run \`${this.axon.settings.prefixes}balance\`!`)
                .catch((err) => this.sendError(msg.channel, `DB Error: Unable to save document - ${err}`)));
            }
        })
    }
}

module.exports = Bank;

