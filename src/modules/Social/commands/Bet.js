const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class Bet extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'bet';
        this.aliases = [
            'gamble'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'bet',
            description: 'Rely on fate to increase your balance... or lower it.',
            usage: 'bet [amount]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 60000,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {

        profile.findById(msg.author.id, (err, doc) => {
            let amount = args[0];

            if (err) {
                return this.error(msg, err, 'db', 'Something went wrong.');
            } else if (!doc || doc.data.economy.wallet === null) {
                return this.sendError(msg.channel, `You don't have a wallet yet! To create one, run \`${this.axon.settings.prefixes}register.`);
            } else if (isNaN(amount)){
                return this.sendError(msg.channel, 'Please enter a valid amount.\nBets must be greater than **499** coins but less than **5,001**');
            } else if (amount < 500 || amount > 5000){
                return this.sendError(msg.channel, 'Amount is out of range. \nBets must be greater than **499** coins but less than **5,001**');
            } else if (amount > doc.data.economy.wallet){
                return this.sendError(msg.channel, `You don't have enough coins in your wallet to proceed with that bet.\nGet more coins from your bank by typing \`${this.axon.settings.prefixes}withdraw\`.`);
            } else {
                doc.data.economy.wallet = doc.data.economy.wallet - Math.floor(amount);
                
                return doc.save()
                .then(() => this.sendSuccess(msg.channel, `Your **${Math.floor(amount)}** has been placed in a bet. Please wait 1 minute for the result.\nOdds for winning the bet is 1/3, and amount won are twice as large up to 10x as large as the original bet!`))
                .then(async () => {
                await this.utils.delayFor(60000);

                const won = Math.floor(Math.random() * 4) === 2 ? true : false;
                const multiplier = Math.floor(Math.random() * 9) + 2;
                const prize = amount * multiplier;

                if (!won){
                    return this.sendError(msg.channel, `You lost **${this.utils.commatize(amount)}** coins from your previous bet!\nYou can get more reliable coins without using the bet command!`);
                };

                doc.data.economy.bank = doc.data.economy.bank + prize;
                return doc.save()
                .then(() => this.sendSuccess(msg.channel, `You won **${this.utils.commatize(amount)}** coins from your previous bet!\nYour bet **${Math.floor(amount)}** coins have multiplied by **${multiplier}**.\nYou'll receive **${this.utils.commatize(prize)}** coins as the prize. Your winnings has been transferred to your bank!`))
                .catch(() => this.error(msg, err, 'internal', `The betting machine just broke! You lost **${this.utils.commatize(amount)}** coins from your previous bet.\nThis doesn't usually happen. Please contact TwoDog or soda if you receive this message.`))
            }).catch((err) => this.error(msg, err, 'db', 'Something went wrong.'));
            }
        })
    }
}

module.exports = Bet;