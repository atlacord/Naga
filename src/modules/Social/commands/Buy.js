const { Command, CommandOptions } = require('axoncore');
const moment = require('moment');
const profile = require('../../../Models/Profile');

class Buy extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'buy';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'buy',
            description: 'Buy items from the shop',
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
            const total = item.price * quantity;

            if (!item.price && amt > 1) {
                return this.sendError(msg.channel, `You may only have 1 free item at a time.`);
            } else if (doc.data.economy.wallet < total) {
                return this.sendError(msg.channel, `You do not have enough credits to proceed with this transaction! You need ${this.utils.commatize(total)} for **${amt}x ${item.name}**`);
            } else if (doc.data.profile.inventory.find(x => x.id === item.id) && !item.price) {
                return this.sendError(msg.channel, `You may only have 1 free item at a time.`);
            } else {

                const old = doc.data.profile.inventory.find(x => x.id === item.id);
                if (old) {
                    const inv = doc.data.profile.inventory;
                    let data = doc.data.profile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
                    data.amount = data.amount + amt;
                    doc.data.profile.inventory.push(data)
                } else {
                    doc.data.profile.inventory.push({
                        id: item.id,
                        amount: amt
                    });
                };

                doc.data.economy.wallet = doc.data.economy.wallet - total;

                return doc.save().then(() => msg.channel.createMessage({
                    allowedMentions: {
                        repliedUser: false
                    }, 
                    embed: {
                        color: this.utils.getColor('green'),
                        description: `${this.utils.emote.success} You successfully purchest **[${amt}x] ${item.name}**!`
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

module.exports = Buy;

