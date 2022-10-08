const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const Wikiapi = require('wikiapi')

const wiki = new Wikiapi('https://avatar-the-last-airbender-discord.fandom.com/api.php');
// const userRegex = /<@([^}]+)>/g;

const ID_REGEX = /\d{5,}/gm

class Wiki extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'editwiki';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'editwiki',
            description: 'Testing wiki automation',
            usage: 'editwiki',
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
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    split(text) {
        let splitText;
        if (text.length > 2000) {
            splitText = text.slice(0, 2000)
        }
        return splitText.toString();
    }

    async execute({msg, args}) {
            // let pages = []
            // const page_list = await wiki.category_tree(args[1], 1);
            // page_list.forEach(p => pages.push(p.title));
            // msg.channel.createMessage(`Category: ${args[1]}, Depth: 1, Results: ${pages.length}`);
            // msg.channel.createMessage(pages.join('\n'));
            const page_data = await wiki.page(args[1]);
            let parsed = page_data.parse();
            let text = page_data.wikitext;
            let id = text.match(ID_REGEX)[0];
            let member = await this.bot.getRESTGuildMember('370708369951948800', id);
            // console.log(member.nick);
            // console.log(id);

            parsed.each('template', template_token => {
                if (template_token.name.startsWith('Users Template')) {
                    template_token[2][2] = `${member.username}#${member.discriminator}`; // Username + Discrim
                    template_token[3][2] = member.nick; // Nickname
                    // console.log(template_token.parameters.nickname);
                    // console.log(template_token);
                    return parsed.each.exit;
                }
            });

            msg.channel.createMessage(this.split(parsed.toString()));
        
            // print json of the infobox
            // msg.channel.createMessage(JSON.stringify(infobox));

    }
}

module.exports = Wiki;