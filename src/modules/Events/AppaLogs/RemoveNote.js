const { Listener } = require('axoncore');

const ID_REGEX = new RegExp(/\d{7,}/, 'gm');

class NoteRemove extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'appaNoteRemove';

        this.enabled = true;

        this.info = {
            description: 'Logs Appa note removals--he',
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
        if (msg.content.startsWith('%dn')) {//'—delnote' || '--delnote')) {
            let content = msg.content.split(' ');
            let note = content[1]

            let embed = {
                color: this.utils.getColor('yellow'),
                title: 'Note Deleted',
                fields: [
                    { name: 'Note', value: note },
                    { name: 'Moderator', value: `${await this.fullName(msg.author.id)} (<@${msg.author.id}>)` },
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

module.exports = NoteRemove;
