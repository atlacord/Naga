const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class Whitelist extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'whitelist';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'whitelist',
            description: 'Add yourself to the whitelist for our Minecraft server (Java Edition username)',
            usage: 'whitelist [username]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 60000,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
        const username = args[0];
        const consoleChannel = await this.bot.getChannel('1125212172230856794');

        profile.findById(msg.author.id, (err, doc) => {

            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            } else if (doc.data.profile.mcusername !== null) {
                this.sendError(msg.channel, `You are already whitelisted as **${doc.data.profile.mcusername}**! Replacing that with **${username}**`);
                doc.data.profile.mcusername = username.toString();
                consoleChannel.createMessage(`whitelist remove ${doc.data.profile.mcusername}`);
                consoleChannel.createMessage(`whitelist add ${username.toString()}`)
            } else {
                doc.data.profile.mcusername = username.toString();
                consoleChannel.createMessage(`whitelist add ${username.toString()}`);
                
                return doc.save()
                .then(() => this.sendSuccess(msg.channel, `**${username}** is now whitelisted! You can join the server at **mc.atla.sh** (Java Edition 1.19.4)`));
            }
        })
    }
}

module.exports = Whitelist;