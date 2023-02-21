const { Listener } = require('axoncore');

const ID_REGEX = new RegExp(/\d{7,}/, 'gm');

class RoleAdd extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'appaRoleAdd';

        this.enabled = true;

        this.info = {
            description: 'Logs Appa role additions',
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
        if (msg.content.startsWith('—add' || '--add')) {
            let id;
            if (ID_REGEX.test(msg.content) === true) {
                id = msg.content.match(ID_REGEX)[0]
            }
            let content = msg.content.split(' ');
            let role = content[1];

            let embed = {
                color: this.utils.getColor('blue'),
                title: 'Role Added',
                fields: [
                    { name: 'Member', value: `${await this.fullName(id)} (<@${id}>)`, inline: true },
                    { name: 'Moderator', value: `${await this.fullName(msg.author.id)} (<@${msg.author.id}>)`, inline: true },
                    { name: 'Role', value: role, inline: true }
                ],
                timestamp: new Date()
            };

            let length;
            if (content[2].length <= 3) {
                length = content[content.length - 1];
                console.log(length);
                if (length.endsWith('m')) {
                    length = length.slice(0, -1)
                    nl = length + ' minutes';
                    embed.fields.push({ name: 'Duration', value: nl, inline: true });
                    embed.fields.push({ name: 'Reason', value: content[3] });
                }

                if (length.endsWith('h')) {
                    length = length.slice(0, -1)
                    nl = length + ' hours';
                    embed.fields.push({ name: 'Duration', value: nl, inline: true });
                    embed.fields.push({ name: 'Reason', value: content[3] });
                }

                if (length.endsWith('d')) {
                    length = length.slice(0, -1)
                    nl = length + ' days';
                    embed.fields.push({ name: 'Duration', value: nl, inline: true });
                    embed.fields.push({ name: 'Reason', value: content[3] });
                }

                if (length.endsWith('w')) {
                    length = length.slice(0, -1)
                    nl = length + ' weeks';
                    embed.fields.push({ name: 'Duration', value: nl, inline: true });
                    embed.fields.push({ name: 'Reason', value: content[3] });
                }
            } else embed.fields.push({ name: 'Reason', value: content[2] });

            if (msg.guildID === '370708369951948800' && msg.content !== null) {
                await this.bot.getChannel('1008421501487304844').createMessage({embed})
            }
        }
    }
}

module.exports = RoleAdd;
