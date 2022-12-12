const { Command, CommandOptions, CommandPermissions } = require('axoncore');

const ID_REGEX = new RegExp(/\d{7,}/, 'gm');

class MessageContext extends Command {

    /**
     * @param {import('axoncore').Module} module
     */

    constructor(module) {
        super(module);

        this.label = 'context';
        this.aliases = [ 'context' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'context',
            description: 'Views context around a message link',
            usage: 'context [message link]',
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

        let oldMessages;
        await this.bot.getMessages(channelID, { before: messageID, limit: 5 })
        .then(async messages => {
            messages = messages.filter(Boolean).map(msg => {
                return `${this.utils.fullName(msg.author)} (<t:${Math.floor(msg.createdAt / 1000)}:R>)  –  ${msg.content}`;
            })
            oldMessages = messages.reverse();
        })
        let message = await this.bot.getMessage(channelID, messageID);
        oldMessages.push(`**${this.utils.fullName(message.author)} (<t:${Math.floor(message.createdAt / 1000)}:R>)  –  ${message.content}**`)
        let msgContent = oldMessages.join('\n');
        let embed = {
            color: this.utils.getColor('blue'),
            author: { 
                name: this.utils.fullName(message.author),
                icon_url: message.author.avatarURL
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