const { Listener } = require('axoncore');

class ExistingTeamAvatar extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'ExistingTeamAvatar';

        this.enabled = true;

        this.info = {
            description: 'Team Avatar-related messages for existing TA members',
        };
    }

    /**
     * @param {import('eris').Message} message
     * @param {import('axoncore').GuildConfig} guildConfig
     */
    execute(message, guildConfig) { // eslint-disable-line
        const TAChannel = '830427148488933406';

        if ((message.type === 8 || 9 || 10) && message.content === `<@${message.author.id}> just boosted the server!`) {
            if (message.member.roles.includes('586128911302131725')) {
                this.sendMessage(TAChannel, `Huge shoutout to ${message.member.mention} for boosting the server once again! Thank you for your continued support!`);
            } return 
        } Promise.resolve();
    }
}

module.exports = ExistingTeamAvatar;
