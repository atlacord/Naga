const { Listener } = require('axoncore');

class AutoContext extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'AutoContext';

        this.enabled = true;

        this.info = {
            description: 'Automatically expands upon message links sent in Dai Li',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */
    async execute(msg) { // eslint-disable-line
        if (msg.author.bot) return;
        if (msg.channel.id !== '761932330028892194') return;
        if (msg.content.includes('https://discord.com/channels/')) {
            let msgLink = msg.content
                              .replaceAll('\n', ' ')
                              .split(' ')
                              .find(word => word.startsWith('https://discord.com/channels/'))
                              .split('/');

            let channelID, messageID;
            channelID = msgLink[5];
            messageID = msgLink[6];

            let quantity = 5;

            let oldMessages;
            await this.bot.getMessages(channelID, { before: messageID, limit: quantity })
            .then(async messages => {
                messages = messages.filter(Boolean).map(msg => {
                    return `**${this.utils.fullName(msg.author)}** (<t:${Math.floor(msg.createdAt / 1000)}:R>)  –  ${msg.content}\n`;
                })
                oldMessages = messages.reverse();
            })
            let message = await this.bot.getMessage(channelID, messageID);
            oldMessages.push(`__**${this.utils.fullName(message.author)} (<t:${Math.floor(message.createdAt / 1000)}:R>)  –  ${message.content}**__`)
            let msgContent = oldMessages.join('\n');
            let embed = {
                color: this.utils.getColor('blue'),
                author: { 
                    name: `Messages sent in #${message.channel.name}`,
                    icon_url: msg.channel.guild.iconURL
                },
                description: `${msgContent}`,
                footer: { text: `Message ID: ${message.id} | Author ID: ${message.author.id}` }
            };

            if (message.attachments.length > 0) {
                embed.image.url = message.attachments[0].url;
            }

            msg.channel.createMessage({ 
                content: `Is that a message link I see? Magic commencing`, 
                embed, 
                messageReference: { messageID: msg.id } 
            });
        }
    }
}

module.exports = AutoContext;