const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class Register extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'register';
        this.aliases = [
            'createwallet'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'register',
            description: 'Start earning credits. Register to keep track of your earned credits!',
            usage: 'register',
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
                this.sendError(msg.channel, `DB Error: ${err.message}`);
            } else if (doc && doc.data.economy.wallet !== null) {
                this.sendError(msg.channel, `You already have a wallet! To check your balance, run \`${this.axon.settings.prefixes}bal\`!`);
            } else if (!doc) {
                doc = new profile({ _id: msg.author.id })
            };

            doc.data.economy.wallet = Math.floor(Math.random() * 250) + 250;

            return doc.save().then(() => this.sendSuccess(msg.channel, `Successfully created your wallet! You received **${doc.data.economy.wallet}** as a gift!`))
            .catch((err) => this.sendError(msg.channel, `DB Error: Unable to save you wallet to the database: ${err}`))
        })
    }
}

module.exports = Register;