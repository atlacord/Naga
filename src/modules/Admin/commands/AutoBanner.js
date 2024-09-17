const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const banners = require('../../../assets/banners.json');
const axios = require('axios');

class ChangeBanner extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'changebanner';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'changebanner',
            description: 'Change banner',
            usage: 'changebanner',
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

    async convertImage(image) {
		var res = await axios.get(image, {
			headers: { Accept: 'image/*' },
			responseType: 'arraybuffer',
		}).then(response => `data:${response.headers['content-type']};base64,${response.data.toString('base64')}`);
        return res;
    }

    async execute() {
        let banner = Math.floor(Math.random() * banners.length);
        banner = banners[banner];
        let res = await this.convertImage(banner);

        try {
            await this.bot.guilds.get('370708369951948800').edit({ banner: res }, 'Weekly autochange');
        } catch (err) {
            console.error(`Failed to change the banner: ${err}`)
        };
    }
}

module.exports = ChangeBanner;