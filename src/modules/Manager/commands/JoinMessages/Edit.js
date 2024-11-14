const { Command, CommandOptions } = require('axoncore');
const server = require('../../../../Models/Server.js');

class Edit extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'edit';
        this.aliases = ['update']

        this.info = {
            name: 'joinmsgs edit',
            description: 'Edit a join message.',
            usage: 'joinmsgs edit [number] [new message]',
            examples: [ 'joinmsgs edit 5 Little soldier {USER} comes marching home' ]
        };

        this.options = new CommandOptions(this, { argsMin: 2 });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
      server.findById(msg.guildID, (err, doc) => {
        const index = parseInt(args[0]) - 1;
        const replacementJoinMessage = args.slice(1).join(' ').trim();

        if (index > doc.data.joinMessages.length - 1){
            return this.sendError(msg.channel, 'Position out of bounds!');
        }

        const oldJoinMessage = doc.data.joinMessages[index];
        doc.data.joinMessages.splice(index, 1, replacementJoinMessage);

        doc.save().then(() => this.sendSuccess(msg.channel, `Join message replaced!\n\nOld: \`${oldJoinMessage}\`\nNew: \`${replacementJoinMessage}\`\n\nUse \`n.joinmsgs list\` to see the updated list.`));
      });
    }
}

module.exports = Edit;

