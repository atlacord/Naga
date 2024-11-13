const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const server = require('../../../Models/Server');
const joinMessages = require('../../../assets/joinmessages.json');

class MigrateJoinMessages extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'migratejoinmessages';
        this.aliases = [ 'migratejoin' ];

        this.info = {
            name: 'migratejoin',
            description: 'Migrates join messages to the database.',
            usage: 'migratejoin'
        };

        this.permissions = new CommandPermissions(this, {
            staff: { bypass: this.axon.staff.owners }
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
      server.findById(msg.guildID, async (err, doc) => {
        if (err) {
          this.sendError(msg.channel, `An error occurred!\n\`\`\`${err}\`\`\``);
        }

        doc.data.joinMessages = [ ...joinMessages ];
        doc.save().then(() => this.sendSuccess(msg.channel, 'Successfully migrated join messages!'));
      });
    }
}

module.exports = MigrateJoinMessages;

