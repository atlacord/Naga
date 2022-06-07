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
            usage: 'wiki Soda',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            guildOnly: false,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    execute( { msg, args } ) {
        try {
            this.sendMessage(msg.channel, `Showing wiki page for \`${args.join(' ')}\`: \nhttps://avatar-the-last-airbender-discord.fandom.com/wiki/${args.join('_')}`);
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Wiki;