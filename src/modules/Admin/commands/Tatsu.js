const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { Tatsu } = require('tatsu');
const { readFileSync, writeFileSync } = require('fs');

const tatsu = new Tatsu('jjyo4ESeJ0-sxQ9dSRB8zmsB8edoxVuE7');

// const userRegex = /<@([^}]+)>/g;

class TatsuTest extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'tatsu';
        this.aliases = ['tt'];

        this.hasSubcmd = false;

        this.info = {
            name: 'scrapelb',
            description: 'Scrapes xp data from a Carl leaderboard embed',
            usage: 'scrapelb [message id]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    sendCode(channel, content, lang = 'js') {
        return this.sendMessage(channel, {
            embed: {
                color: this.utils.getColor('green'),
                author: {
                    name: 'Eval Result',
                    // icon_url: msg.author.avatarURL
                },
                description: `\`\`\`${lang}\n${content}\`\`\``
            }
        });
    }

    async execute({msg, args}) {
        try {
            let profile = await tatsu.getProfile(args[0]);
            profile = profile.toJSON();
            this.sendCode(msg.channel, JSON.stringify(profile.toJSON()));
            
        } catch (err) {
            this.sendError(msg.channel, `Error ${err.statusCode}: ${err.message}`);
        }
    }
}

module.exports = TatsuTest;