const { Listener } = require('axoncore');

class voiceChannelSwitch extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'voiceChannelSwitch';
        /** Event name (Function name) */
        this.label = 'voiceChannelSwitch';

        this.enabled = true;

        this.info = {
            description: 'Logs vc changes',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(member, newChannel, oldChannel) { // eslint-disable-line
        let embed = {
            author: { name: this.utils.fullName(member.user), icon_url: member.user.avatarURL },
            color: this.utils.getColor('green'),
            description: `**${member.mention} switched from voice channel ${oldChannel.mention} to ${newChannel.mention}**`,
            footer: { text: `Member ID: ${member.id}` },
            timestamp: new Date()
        };
        
        await this.bot.getChannel('1008421501487304844').createMessage({embed})
    }
}

module.exports = voiceChannelSwitch;
