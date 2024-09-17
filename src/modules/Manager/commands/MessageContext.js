const { Command, CommandOptions, CommandPermissions } = require('axoncore');

const ID_REGEX = new RegExp(/\d{7,}/, 'gm');

class MessageContext extends Command {

    /**
     * @param {import('axoncore').Module} module
     */

    constructor(module) {
        super(module);

        this.label = 'context';
        this.aliases = [ 'context', 'c'];

        this.hasSubcmd = false;

        this.info = {
            name: 'context',
            description: 'Views context around a message link',
            usage: 'context [message link] [optional quantity]',
        };

        /**
         * @param {CommandOptions}

         */

        this.options = new CommandOptions(this, {
            argsMin: 1,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.sentries,
                bypass: this.axon.staff.owners,
            },
        } );
    }W

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({msg, args}) {
        let msgLink = args[0];
        let channelID, messageID;
        channelID = msgLink.match(ID_REGEX)[1];
        messageID = msgLink.match(ID_REGEX)[2];

        let quantity = args[1] || 5;

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
                icon_url: message.channel.guild.iconURL
            },
            description: `${msgContent}`,
            footer: { text: `Message ID: ${message.id} | Author ID: ${message.author.id}` }
        }

        if (message.attachments.length > 0) {
            embed.image.url = message.attachments[0].url;
        }

        msg.channel.createMessage({embed});
    }
}

module.exports = MessageContext;
