const { Command, CommandOptions, CommandPermissions } = require('axoncore');

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
        try {
        let suggestion = await this.bot.getMessage('792616452770627594', args[0]);

        let embed = {
            author: { name: suggestion.embeds[0].author.name, icon_url: suggestion.embeds[0].author.icon_url },
            title: suggestion.embeds[0].title,
            color: this.utils.color.green,
            description: suggestion.embeds[0].description,
            fields: [
                { name: 'Status', value: `Approved by ${msg.author.username}#${msg.author.discriminator}` },
                { name: 'Reason', value:  args.join(' ').replace(/^([^ ]+ ){1}/, '')}
            ],
            footer: { text: suggestion.embeds[0].footer.text }
        };
            await this.bot.getChannel('792616452770627594').editMessage(args[0], { embed });
            this.sendSuccess(msg.channel, `Successfully approved ${suggestion.embeds[0].author.name}'s suggestion.`);
        } catch (err) {
            this.sendError(msg.channel, err)
        }
    }
}

module.exports = RespondApprove;