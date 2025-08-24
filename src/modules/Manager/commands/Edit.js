const { Command, CommandOptions } = require('axoncore');
const server = require('../../../Models/Server.js');

class Edit extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'edit';
        this.aliases = ['update']

        this.info = {
            name: 'joinmsgs edit, topics edit, atlatopics edit, loktopics edit',
            description: 'Edit a join message or topic. Can specify either the join message/topic number or the message/topic itself. If it\'s the latter, wrap it in square brackets!',
            usage: 'joinmsgs/n.topics edit [number] [replacement], n.joinmsgs/topics [current join message/topic] [replacement]',
            examples: [ 
              'joinmsgs edit 5 Little soldier {USER} comes marching home',
              'joinmsgs edit [Little soldier {USER} comes marching home] Little soldier {USER} comes walking home',
              'topics edit 17 If you were to perform in the circus, how long would you stay?',
              'topics edit [If you were to perform in the circus, what would you do?] If you were to perform in the circus, how long would you stay?',
              'atlatopics edit 54 What is the best friendship in ATLA universe?',
              'atlatopics edit [What is the best friendship in ATLA universe?] What is the best friendship in the ATLA universe?',
              'loktopics edit 73 Do you think the connection to the past lives should be restored?',
              'loktopics edit [Do you think the connection to the past lives should restored?] Do you think the connection to the past lives should be restored?'
            ]
        };

        this.options = new CommandOptions(this, { argsMin: 2 });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args, command }) {
      server.findById(msg.guildID, (err, doc) => {
        let index;
        if (parseInt(args[0])) {
          index = parseInt(args[0]) - 1;
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

        let oldEntry, replacementEntry;
        if (index) {
          replacementEntry = args.slice(1).join(' ').trim();

          if (index > dataSet.length - 1 || index < 0) {
            return this.sendError(msg.channel, 'Position out of bounds!');
          }

          oldEntry = dataSet[index];
        } else {
          args = args.join(' ').trim();
          const oldEntryRegex = /\[(.+?)\]/;

          oldEntry = args.match(oldEntryRegex)[1];
          replacementEntry = args.replace(oldEntryRegex, '').trim();

          index = dataSet.indexOf(oldEntry);
        }

        dataSet.splice(index, 1, replacementEntry);

        doc.save().then(() => this.sendSuccess(msg.channel, `Join message/topic replaced!\n\nOld: \`${oldEntry}\`\nNew: \`${replacementEntry}\`\n\nUse \`${baseCommand} list\` to see the updated list.`));
      });
    }
}

module.exports = Edit;

