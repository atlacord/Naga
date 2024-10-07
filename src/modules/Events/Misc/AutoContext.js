const { Listener } = require('axoncore');

const ALLOWED_CATEGORIES = [
    '372085914765099008', // Moderation
    '372088029495689226', // Logs
    '828540781291241492', // Garden Gate
    '719883529470738523', // Lake Laogai
    '1039274712905298062' // Community
];

const MESSAGE_LINK_REGEX = /https:\/\/(?:canary|ptb)?\.?discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/

class AutoContext extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);
        this.eventName = 'messageCreate';
        this.label = 'AutoContext';
        this.enabled = true;
        this.info = {
            description: 'Automatically expands upon message links sent in staff channels',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */
    async execute(msg) { // eslint-disable-line
        if (msg.author.bot) return;
        if (!ALLOWED_CATEGORIES.includes(msg.channel.parentID)) return;

        let msgLink = msg.content.match(MESSAGE_LINK_REGEX);
        if (!msgLink) return;

        let channelID = msgLink[2];
        let messageID = msgLink[3];

        let quantity = 5;

        let embed, message = await this.bot.getMessage(channelID, messageID);
        if (UPPER_STAFF_CATEGORIES.includes(message.channel.parentID)) return; 

        if (message.embeds.length && (ALLOWED_CATEGORIES.includes(message.channel.parentID)) || message.channel.id === '372098279615496192') {
            embed = message.embeds[0]; // Ssend embed for bot messages sent in log channels or #avatar-feeds without additional context
        } else {
            let oldMessages;
            await this.bot.getMessages(channelID, { before: messageID, limit: quantity })
            .then(async messages => {
                messages = messages.filter(Boolean).map(msg => {
                    return `**${this.utils.fullName(msg.author)}** (<t:${Math.floor(msg.createdAt / 1000)}:R>)  -  ${msg.content}\n`;
                })
                oldMessages = messages.reverse();
            });
            oldMessages.push(`__**${this.utils.fullName(message.author)} (<t:${Math.floor(message.createdAt / 1000)}:R>)  -  ${message.content}**__`);
            let msgContent = oldMessages.join('\n');
            embed = {
                color: this.utils.getColor('blue'),
                author: { 
                    name: `Messages sent in #${message.channel.name}`,
                    icon_url: msg.channel.guild.iconURL
                },
                description: `${msgContent}`,
                footer: { text: `Message ID: ${message.id} | Author ID: ${message.author.id}` },
                timestamp: message.createdAt
            }

            if (message.attachments.length > 0) {
                embed.image = { url: message.attachments[0].url };
            }
        }

        msg.channel.createMessage({ 
            embed, 
            messageReference: { messageID: msg.id } 
        });
    }
}

module.exports = AutoContext;