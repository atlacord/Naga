const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { Channel } = require('eris');
const Reply = require('./Reply');

class Say extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'say';
        this.aliases = [
            'echo',
            'msg'
        ];

        this.hasSubcmd = true;

        this.info = {
            name: 'say',
            description: 'Sends a message to the specified channel',
            usage: 'say [channel] [message]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 2,
            guildOnly: false,
        });

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: [...this.axon.staff.sentries, this.axon.staff.moverstars],
                bypass: this.axon.staff.owners,
            },
        });
    }

    init() {
        return [Reply];
    }
    
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    execute( { msg, args } ) {
        try {
            let channel = args[0].replace('<#','');
            channel = channel.replace('>', '').toString();
            this.bot.getChannel(channel).createMessage(args.slice(1).join(' '));
            msg.addReaction('✅');
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Say;