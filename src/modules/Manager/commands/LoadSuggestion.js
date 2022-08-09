const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const dbsuggestion = require('../../../Models/Suggestion');

class LoadSuggestion extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'loadsuggestion';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'loadsuggestion',
            description: 'Load a suggestion into the db (only suggestions made before July 2022)',
            usage: 'loadsuggestion [message id] [author id]',
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
                needed: this.axon.staff.sentries,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
        const suggestionChannel = '792616452770627594';

        let suggestion = await this.bot.getMessage(suggestionChannel, args[0]);

        if (suggestion.createdAt > 1657252800) {
            return this.sendError(msg.channel, 'No need to load this suggestion into the database. It was already done automatically!')
        }

        else {
            dbsuggestion.findById(args[0], async (err, doc) => {
                if (err) {
                    return this.utils.logError(msg, err, 'db', 'Something went wrong.');
                };

                let embed = suggestion.embeds[0];
                let content = embed.description;
                let status = embed.fields[0].value.split(' ')[0];

                doc = new dbsuggestion({ _id: args[0]});
                doc.data.author = args[1];
                doc.data.content = content;
                doc.data.status = status;
                doc.data.date = suggestion.createdAt;
                doc.save().then(this.sendSuccess(msg.channel, 'Successfully loaded suggestion.')).catch((err), this.sendError(msg.channel, err.stack));
            });
        }
    }
}

module.exports = LoadSuggestion;