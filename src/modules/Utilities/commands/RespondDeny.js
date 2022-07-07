const { Command, CommandOptions, CommandPermissions } = require('axoncore');

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
        let author = msg.channel.guild.members.get(((suggestion.embeds[0].footer.text)).slice(16));

        let embed = suggestion.embeds[0];
        embed.color = this.utils.color.red;
        embed.fields[0] = { name: 'Status', value: `Denied by **${msg.author.username}#${msg.author.discriminator}**` };
        embed.fields.push({ name: 'Reason', value:  args.join(' ').replace(/^([^ ]+ ){1}/, '')});

        try {
            await this.bot.getChannel(suggestionChannel).editMessage(args[0], { embed });
            this.sendSuccess(msg.channel, `Suggestion denied.\n[View Suggestion](${msg.jumpLink})`);
            this.sendDM(author, {
                embed: {
                    title: 'Your suggestion has been responded to!',
                    color: this.utils.color.red,
                    description: embed.description,
                    fields: [
                        { name: 'Status', value: `Denied by **${msg.author.username}#${msg.author.discriminator}**`, inline: false },
                        { name: 'Reason', value:  args.join(' ').replace(/^([^ ]+ ){1}/, ''), inline: false },
                    ],
                    timestamp: new Date()
                }
            })
        } catch (err) {
            this.sendError(err);
        }
    }
}

module.exports = RespondDeny;