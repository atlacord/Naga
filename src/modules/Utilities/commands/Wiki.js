const { Command, CommandOptions } = require('axoncore');
const axios = require('axios');

const wikiHost = 'https://wiki.atla.sh';

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
            description: 'Provides a link to the specified page on the ATLA Discord wiki (case-sensitive for **some** pages).',
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

    async execute( { msg, args } ) {
        try {
            if (!args[0]) {
                this.sendMessage(msg.channel, `Check out our server wiki! \n${wikiHost}`);
            } else {
                let query = args.join(' ');
                query = query.replace(/(^\w{1})|(\s+\w{1})/g, firstWord => firstWord.toUpperCase()).split(' ').join('_');

                let res = await axios.get('https://wiki.atla.sh/pages');
                let pages = res.data;

                if (pages.includes(query)) {
                    this.sendMessage(msg.channel, `Showing wiki page for \`${args.join(' ')}\`: \n${wikiHost}/${query}`);
                } else {
                    this.sendError(msg.channel, 'Page not found. Make sure you are spelling the title correctly!');
                }
            }
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}

module.exports = Wiki;