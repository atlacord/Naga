const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const dbsuggestion = require('../../../Models/Suggestion');

class RespondEdit extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'edit';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'respond edit',
            description: 'Edit a suggestion',
            usage: 'respond edit [message id] [reason]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 2,
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

        dbsuggestion.findById(args[0], async (err, doc) => {
            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            };
            try {   
                // let author = msg.channel.guild.members.get(((suggestion.embeds[0].footer.text)).slice(16));
                let reason = args.join(' ').replace(/^([^ ]+ ){1}/, '');

                let embed = suggestion.embeds[0];
                embed.color = this.utils.getColor('red');
                embed.fields[1].value = reason;


                await this.bot.getChannel(suggestionChannel).editMessage(args[0], { embed });
                this.sendSuccess(msg.channel, `Suggestion edited.\n[View Suggestion](${suggestion.jumpLink})`);
            } catch (err) {
                this.sendError(msg.channel, err);
            }
            doc.data.reason = reason;
            doc.save();
        });
    }
}

module.exports = RespondEdit;