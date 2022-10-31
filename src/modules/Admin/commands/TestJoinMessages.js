const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const messages = require('../../../assets/joinmessages.json');

// const userRegex = /<@([^}]+)>/g;

class TestJoinMessages extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'joinmessages';
        this.aliases = ['joinmsg'];

        this.hasSubcmd = false;

        this.info = {
            name: 'joinmessages',
            description: 'Tests Naga\'s experimental join message feature.',
            usage: 'joinmsg',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 1000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    async execute({ msg, args }) {
        try {
            let joinmsg = args[0] || Math.floor(Math.random() * messages.length);
            let message = messages[joinmsg]
            message = message.replace(/['"]+/g, "'")
            message = message.replace(/{\w[{USER}]+/g, `<@!${msg.author.id}>`);
            msg.channel.createMessage(message)
        } catch (err) {
        this.sendError(msg.channel, err)
        }
    }
}

module.exports = TestJoinMessages;