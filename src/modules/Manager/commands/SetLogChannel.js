const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const server = require('../../../Models/Server');

class SetLogChannel extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'setlogchannel';
        this.aliases = [ 'logchannel' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'setlogchannel',
            description: 'Sets the log channel',
            usage: 'setlogchannel [channel]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 10000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {

        server.findById(msg.guildID, async (err, doc) => {
            let channel = await this.bot.getChannel(args[0]);
            
            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            }
            
            doc.data.logs.logChannel = channel.id;
            console.log(doc.data);
            
            doc.save().then(() => this.sendSuccess(msg.channel, `Successfully set **${channel.name}** as the log channel.`)
            .catch((err) => this.utils.logError(msg, err, 'db', 'Something went wrong.')));
        })
    }
}

module.exports = SetLogChannel;

