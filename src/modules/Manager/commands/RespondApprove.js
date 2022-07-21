const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const dbsuggestion = require('../../../Models/Suggestion');

class RespondApprove extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'approve';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'respond approve',
            description: 'Approve a suggestion',
            usage: 'respond approve [message id] [reason]',
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

            // let author = msg.channel.guild.members.get(((suggestion.embeds[0].footer.text)).slice(16));
            let author = msg.channel.guild.members.get(doc.data.author);

            let status = `Approved by **${msg.author.username}#${msg.author.discriminator}**`;
            let reason = args.join(' ').replace(/^([^ ]+ ){1}/, '');

            let embed = suggestion.embeds[0];
            embed.color = this.utils.color.green;
            embed.fields[0] = { name: 'Status', value: status };
            embed.fields.push({ name: 'Reason', value:  reason });

            try {
                await this.bot.getChannel(suggestionChannel).editMessage(args[0], { embed });
                this.sendSuccess(msg.channel, `Suggestion approved.\n[View Suggestion](${msg.jumpLink})`)
                if (suggestion.createdAt > 1657252800) {
                    this.sendDM(author, {
                        embed: {
                            author: { name: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
                            title: 'Your suggestion has been responded to!',
                            color: this.utils.color.green,
                            description: embed.description,
                            fields: [
                                { name: 'Status', value: status, inline: false },
                                { name: 'Reason', value:  reason, inline: false },
                            ],
                            timestamp: new Date()
                        }
                    });
                }
            } catch (err) {
                this.utils.logError(msg, err, 'internal', 'Something went wrong.');
            }
            doc.data.status = 'Approved';
            doc.data.reason = reason;
            doc.save();
        });
    }
}

module.exports = RespondApprove;