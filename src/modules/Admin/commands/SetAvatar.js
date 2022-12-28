const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const axios = require('axios');

class SetAvatar extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'setavatar';
        this.aliases = ['setav', 'changeav'];

        this.hasSubcmd = false;

        this.info = {
            name: 'setavatar',
            description: 'Change Naga\'s avatar.',
            usage: 'setav [image link]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 60000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
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

    async execute({msg, args}) {
        let res = await this.convertImage(args[0]);

        try {
            await this.bot.editSelf({ avatar: res }).then(this.sendSuccess(msg.channel, 'Avatar changed.'))
        } catch (err) {
            this.sendError(msg.channel, `Failed to change the avatar: ${err}`);
        };
    }
}

module.exports = SetAvatar;