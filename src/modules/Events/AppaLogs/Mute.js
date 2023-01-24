const { Listener } = require('axoncore');

const ID_REGEX = new RegExp(/\d{7,}/, 'gm');

class Mute extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'appaMute';

        this.enabled = true;

        this.info = {
            description: 'Logs Appa bans',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async fullName(user, escape = true) {
        user = await this.bot.getRESTUser(user);

		const discrim = user.discriminator || user.discrim;
		let username = user.username || user.name;

		if (!username) {
			return user.id;
		}

		username = this.utils.clean(username);

		if (escape) {
			username.replace(/\\/g, '\\\\').replace(/`/g, `\`${String.fromCharCode(8203)}`);
		}

		return `${username}#${discrim}`;
	}

    async execute(msg) { // eslint-disable-line
        if (msg.author.bot) return;
        if (msg.content.startsWith('%m')) { // '—mute' || '--unmute')) {
            let id;
            if (ID_REGEX.test(msg.content) === true) {
                id = msg.content.match(ID_REGEX)[0]
            }

            let content = msg.content.split(' ');
            let length;
            let reason;
    
            if (content[2].length <= 3) {
                length = content[2];
                length.split('');
                switch (length[length.length - 1]) {
                    case 'h':
                        length[length.length - 1] = 'hours';
                    case 'd':
                        length[length.length - 1] = 'days';
                }
                length.join(' ')
            } else length = 'Indefinite';
            reason = content[3]

            let embed = {
                color: this.utils.getColor('red'),
                title: 'Mute',
                fields: [
                    { name: 'Member', value: `${await this.fullName(id)} (<@${id}>)` },
                    { name: 'Moderator', value: `${await this.fullName(msg.author.id)} (<@${msg.author.id}>)` },
                    { name: 'Length', value: length },
                    { name: 'Reason', value: reason }
                ],
                footer: { text: `Member ID: ${id}` },
                timestamp: new Date()
            };

            if (msg.guildID === '370708369951948800' && msg.content !== null) {
                await this.bot.getChannel('1008421501487304844').createMessage({embed})
            }
        }
    }
}

module.exports = Mute;
