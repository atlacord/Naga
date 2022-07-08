const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const suggestion = require('../../../Models/Suggestion');

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

    async execute({ msg, args }) {
        const suggestionChannel = '792616452770627594';
        suggestion.findById(msg.id, async (err, doc) => {
            
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
                footer: { text: 'Discuss this suggestion in #suggestions_discussion!' }
            }

            if (msg.attachments.length >= 1) {
                embed.image.url = msg.attachments[0].url;
            }

            let mess = await this.bot.getChannel(suggestionChannel).createMessage({embed})
            msg.delete();
            doc = new suggestion({ _id: mess.id });
            doc.data.author = msg.author.id;
            doc.data.content = args.join(' ');
            doc.data.date = Date.now();
            doc.save();
        })
    }
}

module.exports = Suggest;
