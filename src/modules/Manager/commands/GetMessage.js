const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class GetMessage extends Command {

    /**
     * @param {import('axoncore').Module} module
     */

    constructor(module) {
        super(module);

        this.label = 'getmessage';
        this.aliases = [ 'getmsg' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'getmessage',
            description: 'Sends message content for a provided message',
            usage: 'getmessage [message id]',
        };

        /**
         * @param {CommandOptions}

         */

        this.options = new CommandOptions(this, {
            argsMin: 0,
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
        let message = await this.bot.getMessage(args[0], args[1]);
        message = message.content
        msg.channel.createMessage(`\`\`\`${message}\`\`\``);
    }
}

module.exports = GetMessage;