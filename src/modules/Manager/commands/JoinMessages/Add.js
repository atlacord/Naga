const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const server = require('../../../../Models/Server.js');

class Add extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'add';

        this.info = {
            name: 'joinmsgs add',
            description: 'Adds one or more join messages. Separate multiple messages with the pipe symbol (|).',
            usage: 'joinmsgs add [message(s)]',
            examples: [ 'joinmsgs add Get over here, {USER}. Being part of the group also means being part of group hugs.|Asami and {USER} have returned from their vacation in the spirit world.' ]
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

    async execute({ msg, args }) {
      server.findById(msg.guildID, (err, doc) => {
        if (err) {
          this.sendError(msg.channel, `An error has occurred! Details below:\n${err}`);
          return;
        }

        const userPlaceholderRegex = /\B{USER}\B/;
        const newJoinMessages = args.join(' ').split('|').map((m) => m.trim().replaceAll(/[\n\r]/g, ''));

        for (let m of newJoinMessages) {
          if (!userPlaceholderRegex.test(m)) {
            return this.sendError(msg.channel, 'Incorrect format! Correct examples: `The name\'s {USER} Pippenpaddle-Oppsocopolis... the Third`, `{USER} spins the wheel of judgement and got community service`');
          }
        }

        doc.data.joinMessages.push(...newJoinMessages);
        doc.save().then(() => this.sendSuccess(msg.channel, 'Join message(s) successfully added!'));
      });
    }
}

module.exports = Add;

