const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const server = require('../../../Models/Server');

class IgnoreChannel extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'ignorechannel';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'ignorechannel',
            description: 'Stops a channel (or category) from being logged. Works on threads, channels, and channel categories.',
            usage: 'ignorechannel [channel]',
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
        let channelArr = [];

        server.findById(args[0], async (err, doc) => {
            let channel = await this.bot.getChannel(args[0]);
            
            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            }

            if (channel.type === 4) {
                for (let i in channel.channels) {
                    channelArr.push(channel.channels[i].id);
                }

                for (let i in channelArr) {
                    doc.data.logs.ignoredChannels.push(channelArr[i]);
                }
            }

            if (!doc.data.logs.ignoredChannels.includes(channel.id)) {
                console.log('This would normally ignore the channel.');
                // return doc.data.log.ignoredChannels.push(channel.id)
            };
            
            return doc.save().then(() => this.sendSuccess(msg.channel, `Successfully ignored **${channel.name}** from being logged.`)
            .catch((err) => this.utils.logError(msg, err, 'db', 'Something went wrong.')));
        })
    }
}

module.exports = IgnoreChannel;

