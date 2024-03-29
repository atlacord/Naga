const { Listener } = require('axoncore');

const ID_REGEX = new RegExp(/\d{7,}/, 'gm');

class NoteAdd extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'appaNoteAdd';

        this.enabled = true;

        this.info = {
            description: 'Logs Appa notes',
        };
    }

    cleanRegex = new RegExp('([_\*`])', 'g');

    clean(str) {
	return str.replace(this.cleanRegex, '\\$&');
    }

    fullName(user, escape = true) {
	user = user.user || user;

	const discrim = user.discriminator || user.discrim;
	let username = user.username || user.name;

	if (!username) {
	    return user.id;
	}

	username = this.clean(username);

	if (escape) {
	    username.replace(/\\/g, '\\\\').replace(/`/g, `\`${String.fromCharCode(8203)}`);
	}

        if (discrim === '0') return username;
	else return `${username}#${discrim}`;
    }

    /**
     * @param {import('eris').Message} msg
     */
    async execute(msg) { // eslint-disable-line
        if (msg.author.bot) return;
        if (msg.content.startsWith('d.note') && (!msg.content.startsWith('d.notes'))) {
            let id;
            if (ID_REGEX.test(msg.content) === true) {
                id = msg.content.match(ID_REGEX)[0]
            }

	    let member = await this.bot.getRESTUser(id);
            let content = msg.content.split(' ');
            let reason = content.slice(2).join(' ');

            let embed = {
                color: this.utils.getColor('yellow'),
                author: {
		    icon_url: member.avatarURL,
		    name: `Note | ${this.fullName(member.id)}`
	    	},
                fields: [
                    { name: 'Member', value: `${this.fullName(id)} (<@${id}>)` },
                    { name: 'Moderator', value: `${this.fullName(msg.author.id)} (<@${msg.author.id}>)` },
                    { name: 'Reason', value: reason }
                ],
                footer: { text: `Member ID: ${id}` },
                timestamp: new Date()
            };

            if (msg.guildID === '370708369951948800' && msg.content !== null) {
                await this.bot.getChannel('717197861351063573').createMessage({embed})
            }
        }
    }
}

module.exports = NoteAdd;
