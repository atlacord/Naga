const { Command, CommandOptions } = require('axoncore');
const server = require('../../../Models/Server.js');

class Remove extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'remove';
        this.aliases = ['delete'];

        this.info = {
            name: 'joinmsgs remove, topics remove, atlatopics remove, loktopics remove',
            description: 'Remove a join message or topic. Can specify either the join message/topic number or the message/topic itself.',
            usage: 'joinmsgs remove [number or join message], n.topics remove [number or topic]',
            examples: [ 
              'joinmsgs remove 55', 
              'joinmsgs remove Little soldier {USER} comes marching home',
              'topics remove 806',
              'topics remove If you could create a sequel to any game, what would you choose?',
              'atlatopics remove 50',
              'atlatopics remove If you were the Avatar, what would be your motto? How would you take action when faced with threats?',
              'loktopics remove 75',
              'loktopics remove Did Tenzin have a false perception of himself the whole time?'
            ]
        };

        this.options = new CommandOptions(this, { argsMin: 1 });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args, command }) {
      if (args.length > 1) {
        args = args.join(' ').trim();
      }

      server.findById(msg.guildID, (err, doc) => {
        if (err) {
          return this.sendError(err);
        }

        let dataSet, baseCommand;
        if (command.startsWith('joinmsgs')) {
          dataSet = doc.data.joinMessages;
          baseCommand = 'n.joinmsgs';
        } else if (command.startsWith('topics')) {
          dataSet = doc.data.topics;
          baseCommand = 'n.topics';
        } else if (command.startsWith('atla')) {
          dataSet = doc.data.atlaTopics;
          baseCommand = 'n.atlatopics';
        } else if (command.startsWith('lok')) {
          dataSet = doc.data.lokTopics;
          baseCommand = 'n.loktopics';
        }

        let index;
        if (args.length === 1) {
          index = parseInt(args[0]) - 1;
          if (index > dataSet.length - 1 || index < 0) {
            return this.sendError(msg.channel, 'Position out of bounds!');
          }
        } else {
          index = dataSet.indexOf(args);
          if (index === -1) {
            return this.sendError(msg.channel, 'Join message/topic doesn\'t exist!');
          }
        }

        const deletedEntry = dataSet.splice(index, 1);
        const successMessage = `The following join message/topic has been deleted: \`${deletedEntry}\`\n\nUse \`${baseCommand} list\` to see the updated list.`

        doc.save().then(() => this.sendSuccess(msg.channel, successMessage));
      });
    }
}

module.exports = Remove;

