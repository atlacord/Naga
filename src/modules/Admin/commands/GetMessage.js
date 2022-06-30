const { Command, CommandPermissions, CommandOptions } = require('axoncore');

class GetMessage extends Command {
    constructor(module) {
        super(module);

        this.label = 'getmessage';
        this.aliases = [];

        this.info = {
            name: 'getmessage',
            description: 'For testing purposes only',
            usage: 'getmessage [channel id] [message id]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 2,
            cooldown: null,
            hidden: true,
        } );
        
        /**
         * @type {CommandPermissions}
         */
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */
    
    sendCode(channel, content, lang = 'js') {
        return this.sendMessage(channel, {
            embed: {
                color: this.utils.color.green,
                author: {
                    name: 'Message Contents',
                    // icon_url: msg.author.avatarURL
                },
                description: `\`\`\`${lang}\n${content}\`\`\``
            }
        });
    }

    async execute({ msg, args }) {
        try {
            let message = await this.bot.getMessage(args[0], args[1]);
            msg.channel.createMessage({ embeds: [
                {
                    author: {
                        name: 'Message Contents',    
                    },
                color: this.utils.color.blue,
                description: `\`\`\`${'js'}\n${JSON.stringify(message.embeds[0])}\`\`\``,
                footer: { text: `Author: ${message.author.id}`}
            }
            ]})
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.')
        }
    }
}

module.exports = GetMessage;

