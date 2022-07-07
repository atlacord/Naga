const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class Suggest extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'suggest';
        this.aliases = [
            'suggestion'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'suggest',
            description: 'Make a suggestion!',
            usage: 'suggest [suggestion]',
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

    execute( { msg, args } ) {

        let displayName = msg.member.nick ?? msg.author.username;

        let embed = {
            author: { name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: msg.author.avatarURL },
            title: `${displayName} suggests...`,
            color: this.utils.color.yellow,
            description: args.join(' '),
            image: { url: null },
            fields: [
                { name: 'Status', value: 'Awaiting staff review' }
            ],
            footer: { text: `Suggester's ID: ${msg.author.id}` }
        }

        if (msg.attachments.length >= 1) {
            embed.image.url = msg.attachments[0].url;
        }

        try {
            this.bot.getChannel('792616452770627594').createMessage({embed}).then(() => msg.delete());
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Suggest;
