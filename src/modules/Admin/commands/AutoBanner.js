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
		try {
			var res = await axios.get(image, {
				headers: [{ Accept: 'image/*' }],
				responseType: 'arraybuffer',
			}).then(response => `data:${response.headers['content-type']};base64,${response.data.toString('base64')}`);
		} catch (err) {
			return this.sendError(msg.channel, 'Failed to get a valid image.');
		}
        return res;
    }

    async execute() {
        let banner = Math.floor(Math.random() * banners.length);
        let res = await this.convertImage(banner);

        return this.bot.guilds.get('370708369951948800').edit({ banner: res })
            .then(() => console.log('Changed banner'))
            .catch(() => console.error('Failed to change the banner.'));
    }
}

module.exports = ChangeBanner