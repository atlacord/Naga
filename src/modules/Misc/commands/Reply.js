const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { Channel } = require('eris');

class Reply extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'reply';
        this.aliases = [
            'echo',
            'msg'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'say reply',
            description: 'Sends a message to the specified channel as a reply',
            usage: 'say reply [channel] [reply id] [mention (boolean)] [message]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 4,
            guildOnly: false,
        });

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.sentries,
                bypass: this.axon.staff.owners,
            },
        });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    execute( { msg, args } ) {
        try {
            let channel = args[0].replace('<#','');
            channel = channel.replace('>', '').toString();

            let replyID = args[1]
            let mention = args[2];
            this.bot.getChannel(channel).createMessage({
                content: args.slice(3).join(' '),
                allowedMentions: { repliedUser: mention },
                messageReference: { messageID: replyID }
            });
            msg.addReaction('✅');
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Reply;