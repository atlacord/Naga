const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const banners = require('../../../assets/banners.json');
const axios = require('axios');
const server = require('../../../Models/Server.js');

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
        server.findById('370708369951948800', async (err, doc) => {
            if (doc.data.usedBanners.length === banners.length) {
                doc.data.usedBanners = doc.data.usedBanners.slice(-1); // Keep last element only to prevent it from being used again
            }

            let index, banner;
            do { 
                index = Math.floor(Math.random() * banners.length);
                banner = banners[index]; 
            } while(doc.data.usedBanners.includes(banner));

            doc.data.usedBanners.push(banner);

            let res = await this.convertImage(banner);

            doc.save().then(async () => {
                try {
                    await this.bot.guilds.get('370708369951948800').edit({ banner: res }, 'Weekly autochange');
                } catch (err) {
                    console.error(`Failed to change the banner: ${err}`)
                };
            });
        });
    }
}

module.exports = ChangeBanner;