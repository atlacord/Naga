const { Command, CommandOptions } = require('axoncore');
const server = require('../../../../Models/Server.js');

class Remove extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'remove';
        this.aliases = ['delete'];

        this.info = {
            name: 'joinmsgs remove',
            description: 'Remove a join message. Can specify either the join message number or the message itself.',
            usage: 'joinmsgs remove [number or join message]',
            examples: [ 'joinmsgs remove 55', 'joinmsgs remove Little soldier {USER} comes marching home' ]
        };

        this.options = new CommandOptions(this, { argsMin: 1 });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
      if (args.length > 1) {
        args = args.join(' ').trim();
      }

      server.findById(msg.guildID, (err, doc) => {
        if (err) {
          return this.sendError(err);
        }

        let index;
        if (args.length === 1) {
          index = parseInt(args[0]) - 1;
          if (index > doc.data.joinMessages.length - 1) {
            return this.sendError(msg.channel, 'Position out of bounds!');
          }
        } else {
          index = doc.data.joinMessages.indexOf(args);
          if (index === -1) {
            return this.sendError(msg.channel, 'Join message doesn\'t exist!');
          }
        }

        const deletedJoinMsg = doc.data.joinMessages.splice(index, 1);
        doc.save().then(() => this.sendSuccess(msg.channel, `The following join message has been deleted: \`${deletedJoinMsg}\`\n\nUse \`n.joinmsgs list\` to see the updated list (don't use old lists, they're out of date).`));
      });
    }
}

module.exports = Remove;

