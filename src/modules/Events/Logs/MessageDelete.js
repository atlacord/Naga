const { Listener } = require('axoncore');

class MessageDelete extends Listener {
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
            footer: { text: `Author: ${msg.author.id} | Message ID: ${msg.id}` },
            timestamp: new Date()
        };

        if (msg.guildID === '370708369951948800' && msg.content !== null) {
            await this.bot.getChannel('1008421501487304844').createMessage({embed})
        }
    }
}

module.exports = MessageDelete;
