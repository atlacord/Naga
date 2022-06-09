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

        let embed = {
            author: { name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: msg.author.avatarURL },
            title: `${msg.member.nick} suggests...`,
            color: this.utils.color.yellow,
            description: args.join(' '),
            fields: [
                { name: 'Status', value: 'Awaiting staff review' }
            ],
            footer: { text: 'Discuss this suggestion in #suggestions_discussion!' }
        }

        try {
            this.bot.getChannel('792616452770627594').createMessage({embed}).then(() => msg.delete());
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Suggest;