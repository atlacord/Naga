const { Command, CommandOptions } = require('axoncore');
const moment = require('moment');
const profile = require('../../../Models/Profile');

class Sell extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'sell';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'sell',
            description: 'Sell items to the shop',
            usage: 'buy [item ID] [quantity]',
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

    async execute({ msg, args }) {
        profile.findById(msg.author.id, (err, doc) => {

            let id = args[0];
            let quantity = args[1];

            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            };

            const item = market.find(x => x.id === id);

            if (!item) {
                return this.sendError(msg.channel, `Could not find the item with ID ${id}!`);
            }

            quantity = Math.floor(Math.abs(quantity)) || 1;
            const total = item.price * 0.7 * quantity;
            const itemcount = doc.data.profile.inventory.find(x => x.id === item.id)?.amount;

            if (!itemcount || itemcount < quantity) {
                return this.sendError(msg.channel, `You do not have the necessary amount of **${item.name}** to sell.`);
            } else if (!item.price) {
                return this.sendError(msg.channel, `Unable to sell ${item.name}.`);
            } else if (doc.data.economy.bank === null) {
                return this.sendError(msg.channel, `You cannot sell items yet without a bank. Create one before selling items.`);
            } else {

                const inventory = doc.data.profile.inventory;
                const old = inventory.find(x => x.id === item.id);

                let data = doc.data.profile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
                data.amount = data.amount - quantity;

                if (data.amount > 0) {
                    inventory.push(data);
                } else if (item.assets.link === doc.data.profile[item.type]) {
                    doc.data.profile[item.type] = null;
                };

                doc.data.economy.bank = doc.data.economy.bank + total;

                return doc.save().then(() => msg.channel.createMessage({
                    allowedMentions: {
                        repliedUser: false
                    }, 
                    embed: {
                        color: this.utils.getColor('green'),
                        description: `${this.utils.emote.success} Successfully sold **[${quantity}x] ${item.name}** for **${this.utils.commatize(total)}**`
                    },
                    messageReference: {
                        guildID: msg.channel.guild.id,
                        channelID: msg.channel.id,
                        messageID: msg.id
                    }
                })).catch((err) => this.utils.logError(msg, err, 'db', 'Something went wrong.'));
            }   
        })
    }
}

module.exports = Sell;

