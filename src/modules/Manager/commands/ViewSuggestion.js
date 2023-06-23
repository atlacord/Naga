const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const suggestion = require('../../../Models/Suggestion');

class ViewSuggestion extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'viewsuggestion';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'viewsuggestion',
            description: 'Displays a suggestion (can only be used in bot interface or wloffice)',
            usage: 'viewsuggestion [message id]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 5000,
            guildOnly: true,
        });

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.sentries,
                bypass: this.axon.staff.owners,
            },
            channels: {
                needed: ['570053930193518594', '831909387307319336', '983618760525090869', '411903716996677639', '830427148488933406']
            }
        });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
        const suggestionChannel = '792616452770627594';
        try {
            suggestion.findById(args[0], async (err, doc) => {
                if (err) {
                    return this.utils.logError(msg, err, 'db', 'Something went wrong.');
                };

                let author = await this.bot.guilds.get('370708369951948800').members.get(doc.data.author) || this.bot.getRESTUser(doc.data.author);
                let suggestionColor = this.utils.getColor('blue');

                if (doc.data.status === 'Approved') {
                    suggestionColor = this.utils.getColor('green');
                }

                if (doc.data.status === 'Denied') {
                    suggestionColor = this.utils.getColor('red');
                }

                return this.sendMessage(msg.channel, { 
                    embed: {
                        author: { name: this.utils.fullName(author), icon_url: author.avatarURL },
                        color: suggestionColor,
                        description: `${doc.data.content}\n\n[Jump to Suggestion](https://discord.com/channels/${msg.guildID}/${suggestionChannel}/${doc._id})`,
                        fields: [
                            { name: 'Status', value: doc.data.status, inline: false },
                            { name: 'Reason', value: doc.data.reason || 'N/A', inline: false },
                        ],
                        footer: { text: `Member ID: ${author.id}` },
                        timestamp: doc.data.date
                    }
                })
            })
        } catch (err) {
            this.utils.logError(msg, )
        }
    }
}

module.exports = ViewSuggestion;

