const { Listener } = require('axoncore');

class MessageUpdate extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageUpdate';
        /** Event name (Function name) */
        this.label = 'messageUpdate';

        this.enabled = true;

        this.info = {
            description: 'Logs edited messages',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(message, oldMessage) { // eslint-disable-line
        if (message.author.bot) return;
        if (oldMessage !== null) {
            let embed = {
                author: { name: this.utils.fullName(message.author), icon_url: message.author.avatarURL },
                color: this.utils.getColor('green'),
                description: `**Message sent by ${message.author.mention} edited in ${message.channel.mention}**`,
                fields: [
                    { name: 'From', value: oldMessage.content },
                    { name: 'To', value: message.content }
                ],
                footer: { text: `Author: ${message.author.id} | Message ID: ${message.id}` },
                timestamp: new Date()
            };

            if (message.guildID === '370708369951948800') {
                await this.bot.getChannel('1008421501487304844').createMessage({embed})
            }
        }
    }
}

module.exports = MessageUpdate;
