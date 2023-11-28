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

    async execute({msg}) { // eslint-disable-line
        if (msg.author.bot) return;
        if (msg.content.startsWith('https://discord.com/channels/') && msg.channel.id === '761932330028892194') {
        // begins here
        let msgLink = msg.content[0];
        let channelID, messageID;
        channelID = msgLink.match(ID_REGEX)[1];
        messageID = msgLink.match(ID_REGEX)[2];

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
                name: `I detected a message link! Here are the  messages sent in #${message.channel.name}`,
                icon_url: message.channel.guild.iconURL
            },
            description: `${msgContent}`,
            footer: { text: `Message ID: ${message.id} | Author ID: ${message.author.id}` }
        }

        if (message.attachments.length > 0) {
            embed.image.url = message.attachments[0].url;
        }

        msg.channel.createMessage({embed});
        // ends here
         
        }
    }
}

module.exports = AutoContext;