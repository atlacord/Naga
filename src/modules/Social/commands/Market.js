const { Command, CommandOptions } = require('axoncore');
const moment = require('moment');
const _ = require('lodash');
const market = require('../../../assets/market.json');
const PaginationManager = require('../../../PaginationManager');

class Market extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'market';
        this.aliases = ['shop', 'itemshop', 'store'];

        this.hasSubcmd = false;

        this.paginator = PaginationManager;

        this.info = {
            name: 'market',
            description: 'Naga\'s item shop',
            usage: 'market [optional page number]',
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
        let pageEmbeds = [];
        const pages = _.chunk(selected, 24).map((chunk, i, o) => {
            let embed = {
                color:  this.utils.getColor('blue'),
                title: 'Naga\'s Market',
                fields: []
            }
            chunk.map(item => {
                embed.fields.push({
                    inline: true,
                    name: `\`[${item.id}]\` ${item.name}`,
                    value: [
                    item.description,
                    `Type: *${item.type}*`,
                    `Price: *${this.utils.commatize(item.price)}*`,
                    `Purchase: \`n.buy ${item.id} [amount]\``
                    ].join('\n')
                });
            });
        });

        /*         
        let options = {
            allowedMentions: {
                repliedUser: false
            },

            messageReference: {
                guildID: msg.channel.guild.id,
                channelID: msg.channel.id,
                messageID: msg.id
            }
        } */
        await this.paginator.createPaginationEmbed(msg, pages, options)

    }
}

module.exports = Market;