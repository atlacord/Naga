const { Command, CommandPermissions } = require('axoncore');
const List = require('./List.js');
const Edit = require('./Edit.js');
const Add = require('./Add.js');
const Remove = require('./Remove.js');
const server = require('../../../Models/Server.js');

class AtlaTopics extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'atlatopics';
        this.aliases = ['atla'];

        this.hasSubcmd = true;

        this.info = {
            name: 'atlatopics',
            description: 'Master command for operations related to ATLA topics',
        };

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: [...this.axon.staff.sentries, ...this.axon.staff.admins],
                bypass: this.axon.staff.owners,
            },
        } );
    }

    init() {
        return [List, Edit, Add, Remove];
    }
    
    async execute({ msg, args }) {
        if (args.length === 1 && parseInt(args[0])) {
            server.findById(msg.guildID, async (err, doc) => {
                const index = parseInt(args[0]) - 1;
                const topics = doc.data.atlaTopics;

                if (index > topics.length - 1 || index < 0) {
                    return this.sendError(msg.channel, 'Position out of bounds!');
                }

                const topic = topics[index];
                msg.channel.createMessage({
                    embed: {
                        color: this.utils.getColor('blue'),
                        title: `ATLA Topic ${args[0]}`,
                        description: topic
                    }
                })
            });
        } else {
            msg.channel.createMessage('Subcommands available: `n.atlatopics add`, `n.atlatopics remove`, `n.atlatopics edit`, and `n.atlatopics list`. For more info about one, run the subcommand with no arguments. To view a specific topic, run `n.atlatopics [topic number]`.');
        }
    }
}

module.exports = AtlaTopics;

