const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const server = require('../../../Models/Server');
const atlaTopics = require('../../../assets/atlatopics.json');
const lokTopics = require('../../../assets/korratopics.json');

class MigrateAvatarTopics extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'migrateavatar';

        this.info = {
            name: 'migrateavatar',
            description: 'Migrates atla and lok topics to the database.',
            usage: 'migrateavatar',
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

        doc.data.atlaTopics = [ ...atlaTopics ];
        doc.data.lokTopics = [ ...lokTopics ];
        
        doc.save().then(() => this.sendSuccess(msg.channel, 'Successfully migrated Avatar topics!'));
      });
    }
}

module.exports = MigrateAvatarTopics;

