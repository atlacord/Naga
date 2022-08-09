const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const dbsuggestion = require('../../../Models/Suggestion');

class RespondDeny extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'deny';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'respond deny',
            description: 'Deny a suggestion',
            usage: 'respond deny [message id] [reason]',
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
                let author = msg.channel.guild.members.get(doc.data.author) || msg.channel.guild.members.get(((suggestion.embeds[0].footer.text)).slice(16));

                let status = `Denied by **${msg.author.username}#${msg.author.discriminator}**`;
                let reason = args.join(' ').replace(/^([^ ]+ ){1}/, '');

                let embed = suggestion.embeds[0];
                embed.color = this.utils.color.red;
                embed.fields[0] = { name: 'Status', value: status };
                embed.fields.push({ name: 'Reason', value:  reason });


                await this.bot.getChannel(suggestionChannel).editMessage(args[0], { embed });

                if ((suggestion.createdAt > 1657252800) && (author !== null)) {
                    try {
                        this.sendDM(author, {
                            embed: {
                                author: { name: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
                                title: 'Your suggestion has been responded to!',
                                color: this.utils.color.red,
                                description: embed.description,
                                fields: [
                                    { name: 'Status', value: status, inline: false },
                                    { name: 'Reason', value:  reason, inline: false },
                                ],
                                timestamp: new Date()
                            }
                        })
                    } catch(err) {
                        this.sendError(msg.channel, err);
                    }
                }
                this.sendSuccess(msg.channel, `Suggestion denied.\n[View Suggestion](${suggestion.jumpLink})`);
            } catch (err) {
                this.sendError(msg.channel, err);
            }
            doc.data.status = 'Denied';
            doc.data.reason = reason;
            doc.save();
        });
    }
}

module.exports = RespondDeny;