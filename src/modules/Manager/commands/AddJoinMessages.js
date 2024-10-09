const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const server = require('../../../Models/Server.js');

class AddJoinMessages extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'addjoinmessages';
        this.aliases = [ 'addjoin', 'addjoinmessage' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'addjoinmessages',
            description: 'Adds one or more join messages. Separate multiple messages with the pipe symbol (|).',
            usage: 'addjoinmessages [message(s)]',
            examples: [ 'addjoinmessages Get over here, {USER}. Being part of the group also means being part of group hugs.|Asami and {USER} have returned from their vacation in the spirit world.' ]
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: [...this.axon.staff.sentries, ...this.axon.staff.admins],
                bypass: this.axon.staff.owners,
            },
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

        const userPlaceholderRegex = /{USER}+/;
        const newJoinMessages = args.join(' ').split('|').map((m) => m.trim());

        for (let m of newJoinMessages) {
          if (!userPlaceholderRegex.test(m)) {
            return this.sendError(msg.channel, 'You need to have {USER} (case sensitive) present in your join message(s)!');
          }
        }

        doc.data.joinMessages.push(...newJoinMessages);
        doc.save().then(() => this.sendSuccess(msg.channel, 'Join message(s) successfully added!'));
      });
    }
}

module.exports = AddJoinMessages;

