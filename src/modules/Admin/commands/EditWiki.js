const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const Wikiapi = require('wikiapi')

const wiki = new Wikiapi('https://wiki.atla.sh/api.php');
// const userRegex = /<@([^}]+)>/g;

const ID_REGEX = new RegExp(/\d{7,}/, 'gm');

class Wiki extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'editwiki';
        this.aliases = [ 'edw' ];

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
        try {

            await wiki.login('SupremeLeaderPabu', 'Naga@uqecqgt7nkl1rg5sci2ima0fr8t7njsg');
            // let pages = []
            // const page_list = await wiki.category_tree(args[1], 1);
            // page_list.forEach(p => pages.push(p.title));
            // msg.channel.createMessage(`Category: ${args[1]}, Depth: 1, Results: ${pages.length}`);
            // msg.channel.createMessage(pages.join('\n'));
            let title;
            const page_list = await wiki.category_tree('People', 1);
            page_list[0].title = page_list[0].title.slice(0, 4);
            this.sendSuccess(msg.channel, `Now editing ${page_list.length} pages. If an error occurs, double check that the page it broke on has a valid user ID.`);
            for (let i = 11; i <= page_list.length; i += 1) {
                title = page_list[i].title;
                console.log(title);
                const page_data = await wiki.page(title);
                let parsed = page_data.parse();
                let text = page_data.wikitext;
                // console.log(text);
                let id;
                if (ID_REGEX.test(text) === true) {
                    id = text.match(ID_REGEX)[0]
                } else {
                    this.sendError(msg.channel, 'No ID found. Continuing...');
                    continue;
                }
                console.log(id);

                let isMember = true;
                let member = await this.bot.getRESTGuildMember('370708369951948800', id).catch(err => console.log(err), isMember = false);
                
                // console.log(member.nick);
                // console.log(id);

                if (isMember === false) {
                    try {
                        member = await this.bot.getRESTUser(id);
                    } catch (err) {
                        continue;
                    }
                }

                parsed.each('template', template_token => {
                    if (template_token.name.startsWith('Users Template')) {
                        template_token[2][2] = this.utils.fullName(member); // Username + Discrim
                        if (isMember === true) {
                            let nick;
                            if (member.nick === undefined) {
                                nick = member.username;
                            } else {
                                nick = member.nick;
                            }
                            template_token[3][2] = nick; // Nickname
                        }
                        // console.log(template_token.parameters.nickname);
                        // console.log(template_token);
                        return parsed.each.exit;
                    }
                });

                this.sendSuccess(msg.channel, `Successfully edited **${title}**'s page. Check the console to confirm.`);
                await wiki.edit(parsed.toString(), { bot: 1, minor: 1, nocreate: 1, summary: 'Editing member info' });
            
                // print json of the infobox
                // msg.channel.createMessage(JSON.stringify(infobox));
                this.utils.delayFor(2500);
            }
        } catch (err) {
            this.sendError(msg.channel, err.stack);
        }
    }
}



module.exports = Wiki;