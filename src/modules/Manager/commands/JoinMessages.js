const { Command, CommandPermissions } = require('axoncore');
const List = require('./List.js');
const Edit = require('./Edit.js');
const Add = require('./Add.js');
const Remove = require('./Remove.js');

class JoinMessages extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'joinmsgs';
        this.aliases = ['joinmsg'];

        this.hasSubcmd = true;

        this.info = {
            name: 'joinmsgs',
            description: 'Master command for operations related to join messages',
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
    
    async execute({ msg }) {
      msg.channel.createMessage('Subcommands available: `n.joinmsgs add`, `n.joinmsgs remove`, `n.joinmsgs edit`, and `n.joinmsgs list`. For more info about one, run the subcommand with no arguments.');
    }
}

module.exports = JoinMessages;

