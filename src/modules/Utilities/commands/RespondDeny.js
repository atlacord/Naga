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
        let suggestion = await this.bot.getMessage('792616452770627594', args[0]);

        let embed = {
            author: { name: suggestion.embeds[0].author.name, icon_url: suggestion.embeds[0].author.icon_url },
            title: suggestion.embeds[0].title,
            color: this.utils.color.red,
            description: suggestion.embeds[0].description,
            fields: [
                { name: 'Status', value: `Denied by ${msg.author.username}#${msg.author.discriminator}` },
                { name: 'Reason', value:  args.join(' ').replace(/^([^ ]+ ){1}/, '')}
            ],
            footer: { text: suggestion.embeds[0].footer.text }
        };
        try {
            await this.bot.getChannel('792616452770627594').editMessage(args[0], { embed });
            msg.channel.createMessage(`Successfully denied ${suggestion.embeds[0].author.name}'s suggestion.`);
        } catch (err) {
            console.log(err)
            this.sendError(err);
        }
    }
}

module.exports = RespondDeny;