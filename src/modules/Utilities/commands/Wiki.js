const { Command, CommandOptions } = require('axoncore');

class Wiki extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'wiki';
        this.aliases = [
            'atlawiki',
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'wiki',
            description: 'Provides a link to the specified page on the ATLA Discord wiki (case-sensitive)',
            usage: 'wiki Beach Party Gaang',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    execute( { msg, args } ) {
        try {
            if (!args[0]) {
                this.sendMessage(msg.channel, `Check out our server wiki! \nhttps://avatar-the-last-airbender-discord.fandom.com`);
            } else {
                this.sendMessage(msg.channel, `Showing wiki page for \`${args.join(' ')}\`: \nhttps://avatar-the-last-airbender-discord.fandom.com/wiki/${args.join('_')}`);
            }
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}

module.exports = Wiki;