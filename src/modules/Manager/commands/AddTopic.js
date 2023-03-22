const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const server = require('../../../Models/Server');

class AddTopic extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'addtopic';
        this.aliases = [ 'newtopic' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'addtopic',
            description: 'Adds a new topic to Naga\'s library.',
            usage: 'addtopic [topic]',
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
                needed: this.axon.staff.sentries,
                bypass: this.axon.staff.owners,
            },
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
        server.findById(msg.guildID, async (err, doc) => {
            
            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            }
            
            let topic = args.slice(1).join(' ');
            doc.data.topics.push(topic);
            
            doc.save().then(() => this.sendSuccess(msg.channel, `Successfully added topic to Naga's library.\nTotal number of topics: ${doc.data.topics.length}`)
            .catch((err) => this.utils.logError(msg, err, 'db', 'Something went wrong.')));
        })
    }
}

module.exports = AddTopic;

