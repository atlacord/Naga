const { Listener } = require('axoncore');
const Eris = require('eris');

const SHARED_STAFF_CATEGORIES = [
    '372085914765099008', // Moderation
    '372088029495689226', // Logs
    '1039274712905298062' // Community
];

const UPPER_STAFF_CATEGORIES = [
    '828540781291241492', // Garden Gate
    '719883529470738523', // Lake Laogai
];

const ADMIN_CHANNELS = [
    '370708369951948802', // old-people-camp
    '1108139717955944488', // internal-changelog
]

const MOVER_STARS_CHANNELS = [
    '1032450052112793700', // mover-stars
    '1049810187650879498', // partners-chat
    '869740603557158973', // wiki
]

const ALLOWED_CATEGORIES = [ ...SHARED_STAFF_CATEGORIES, ...UPPER_STAFF_CATEGORIES ];

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
     * Gets the category ID of a given channel. If the channel is a thread, the parent text channel's category ID is retrieved.
     * @param {eris.Channel} channel - The channel to be evaluated
     * @param {String} categoryID - The category ID
     */
    getCategoryID(channel) {
        let categoryID = channel.parentID;
        if (channel instanceof Eris.PublicThreadChannel || channel instanceof Eris.PrivateThreadChannel) {
            let parentTextChannel = this.bot.getChannel(categoryID);
            categoryID = parentTextChannel.parentID;
        }
        return categoryID;
    }

    /**
     * @param {import('eris').Message} msg
     */
    async execute(msg) { // eslint-disable-line
        if (msg.author.bot) return;

        let parentID = this.getCategoryID(msg.channel);
        if (!ALLOWED_CATEGORIES.includes(parentID)) return;

        let msgLink = msg.content.match(MESSAGE_LINK_REGEX);
        if (!msgLink) return;

        let channelID = msgLink[2];
        let messageID = msgLink[3];

        let quantity = 5;

        let embed, linkedMessage = await this.bot.getMessage(channelID, messageID);
        if (linkedMessage.channel instanceof Eris.PrivateThreadChannel) return;

        // Links from admin channels and threads can only embed in those same places
        if (
            (ADMIN_CHANNELS.includes(linkedMessage.channel.id) || ADMIN_CHANNELS.includes(linkedMessage.channel.parentID)) && 
            (!ADMIN_CHANNELS.includes(msg.channel.id) && !ADMIN_CHANNELS.includes(msg.channel.parentID))
        ) {
           return;
        }

        // Links from Mover Stars channels and threads can only embed in those same places
        if (
            (MOVER_STARS_CHANNELS.includes(linkedMessage.channel.id) || MOVER_STARS_CHANNELS.includes(linkedMessage.channel.parentID)) && 
            (!MOVER_STARS_CHANNELS.includes(msg.channel.id) && !MOVER_STARS_CHANNELS.includes(msg.channel.parentID)) &&
            (!ADMIN_CHANNELS.includes(msg.channel.id) && !ADMIN_CHANNELS.includes(msg.channel.parentID))
        ) {
           return;
        }

        let linkedMessageCategoryID = this.getCategoryID(linkedMessage.channel);

        // Prevent links from upper staff categories from embedding in shared staff categories
        if (UPPER_STAFF_CATEGORIES.includes(linkedMessageCategoryID) && SHARED_STAFF_CATEGORIES.includes(parentID)) return;

        // Prevent links from the Moderation and Logs categories from embedding in the Community category
        if ((linkedMessageCategoryID === '372085914765099008' || linkedMessageCategoryID === '372088029495689226') && parentID === '1039274712905298062') return;

        if (linkedMessage.embeds.length && (ALLOWED_CATEGORIES.includes(linkedMessageCategoryID)) || linkedMessage.channel.id === '372098279615496192') {
            embed = linkedMessage.embeds[0]; // Send embed for bot messages sent in log channels or #avatar-feeds without additional context
        } else {
            let oldMessages;
            await this.bot.getMessages(channelID, { before: messageID, limit: quantity })
            .then(async messages => {
                messages = messages.filter(Boolean).map(msg => {
                    return `**${this.utils.fullName(msg.author)}** (<t:${Math.floor(msg.createdAt / 1000)}:R>)  -  ${msg.content}\n`;
                })
                oldMessages = messages.reverse();
            });
            oldMessages.push(`__**${this.utils.fullName(linkedMessage.author)} (<t:${Math.floor(linkedMessage.createdAt / 1000)}:R>)  -  ${linkedMessage.content}**__`);
            let msgContent = oldMessages.join('\n');
            embed = {
                color: this.utils.getColor('blue'),
                author: { 
                    name: `Messages sent in #${linkedMessage.channel.name}`,
                    icon_url: msg.channel.guild.iconURL
                },
                description: `${msgContent}`,
                footer: { text: `Message ID: ${linkedMessage.id} | Author ID: ${linkedMessage.author.id}` },
                timestamp: new Date(linkedMessage.createdAt).toISOString()
            }

            if (linkedMessage.attachments.length > 0) {
                embed.image = { url: linkedMessage.attachments[0].url };
            }
        }

        msg.channel.createMessage({ 
            embed, 
            messageReference: { messageID: msg.id } 
        });
    }
}

module.exports = AutoContext;