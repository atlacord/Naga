const { Listener } = require('axoncore');

class guildMemberRemove extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildMemberRemove';
        /** Event name (Function name) */
        this.label = 'guildMemberRemove';

        this.enabled = true;

        this.info = {
            description: 'Logs member leave',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(guild, member) { // eslint-disable-line
        let embed = {
            author: { name: 'Member Left' },
            color: this.utils.getColor('red'),
            description: `${member.mention} ${this.utils.fullName(member.user)}`,
            fields: [
                { name: 'Member Joined', value: `<t:${Math.floor(member.joinedAt / 1000)}:f> (<t:${Math.floor(member.joinedAt / 1000)}:R>)`},
                { name: 'Account Created', value: `<t:${Math.floor(member.user.createdAt / 1000)}:f> (<t:${Math.floor(member.user.createdAt / 1000)}:R>)` },
            ],
            footer: { text: `Member ID: ${member.id}` },
            timestamp: new Date()
        };

        await this.bot.getChannel('1008421501487304844').createMessage({embed})
    }
}

module.exports = guildMemberRemove;
