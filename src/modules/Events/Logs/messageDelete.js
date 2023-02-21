const { Listener } = require('axoncore');

const ignoredCategories = ['372085914765099008', '828540781291241492', '719883529470738523'];

class messageDelete extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageDelete';
        /** Event name (Function name) */
        this.label = 'messageDelete';

        this.enabled = true;

        this.info = {
            description: 'Logs deleted messages',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(msg) { // eslint-disable-line
        if (msg.author.bot) return;
        let embed = {
            author: { name: this.utils.fullName(msg.author), icon_url: msg.author.avatarURL },
            color: this.utils.getColor('red'),
            description: `**Message sent by ${msg.author.mention} deleted in ${msg.channel.mention}**\n\n${msg.content}`,
            fields: [],
            footer: { text: `Author ID: ${msg.author.id} | Message ID: ${msg.id}` },
            timestamp: new Date()
        };

        if (msg.referencedMessage !== (undefined || null)) {
            embed.fields.push(
                { name: 'Reply To', value: `${msg.referencedMessage.content}\n\n**Sent by:** ${this.utils.fullName(msg.referencedMessage.author)} (${msg.referencedMessage.author.id})`, inline: false }
            );
        };

        if (msg.guildID === '370708369951948800' && msg.content !== null) {
            if (!ignoredCategories.includes(msg.channel.parentID)) {
                await this.bot.getChannel('1008421501487304844').createMessage({embed})
            }
        }
    }
}

module.exports = messageDelete;