const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const server = require('../../../Models/Server.js');

class Add extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'add';

        this.info = {
            name: 'joinmsgs add, topics add',
            description: 'Adds one or more join messages or topics. Separate multiple arguments with the pipe symbol (|). If adding a join message, be sure to include {USER}!',
            usage: 'joinmsgs add [message(s)], n.topics add [topic(s)]',
            examples: [ 
              'joinmsgs add Get over here, {USER}. Being part of the group also means being part of group hugs.|Asami and {USER} have returned from their vacation in the spirit world.', 
              'topics add Where is the worst place you have been stuck for a long time?|What is your favorite car model?'
            ]
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args, command }) {
      server.findById(msg.guildID, (err, doc) => {
        if (err) {
          this.sendError(msg.channel, `An error has occurred! Details below:\n${err}`);
          return;
        }

        let successMessage;
        if (command.startsWith('joinmsgs')) {
          const userPlaceholderRegex = /\B{USER}\B/;
          const newJoinMessages = args.join(' ').split('|').map((m) => m.trim().replaceAll(/[\n\r]/g, ''));

          for (let m of newJoinMessages) {
            if (!userPlaceholderRegex.test(m)) {
              return this.sendError(msg.channel, 'Incorrect format! Correct examples: `The name\'s {USER} Pippenpaddle-Oppsocopolis... the Third`, `{USER} spins the wheel of judgement and got community service`');
            }
          }

          doc.data.joinMessages.push(...newJoinMessages);
          successMessage = 'Join message(s) successfully added!';
        } else if (command.startsWith('topics')) {
          const newTopics = args.join(' ').split('|').map((m) => m.trim().replaceAll(/[\n\r]/g, ''));
          doc.data.topics.push(...newTopics); 
          successMessage = 'Topic(s) successfully added!';
        }

        doc.save().then(() => this.sendSuccess(msg.channel, successMessage));
      });
    }
}

module.exports = Add;

