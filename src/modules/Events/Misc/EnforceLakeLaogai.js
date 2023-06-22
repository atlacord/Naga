const { Listener } = require('axoncore');

class EnforceLakeLaogai extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildMemberAdd';
        /** Event name (Function name) */
        this.label = 'EnforceLakeLaogai';

        this.enabled = true;

        this.info = {
            description: 'Kicks users from Lake Laogai if they aren\'t banned from the main server',
        };
    }

    async execute(guild, member) {
        // let bans = this.bot.guilds.get('370708369951948800').getBans();
        let ban = await this.bot.guilds.get('370708369951948800').getBan(member.id).catch((e) => { if (e.message === 'Unknown Ban') { return false } else return true });
        if ((guild.id === '736344840253472830') && (ban === false)) {
            member.kick('Not banned from main server.');
        }
    }
}

module.exports = EnforceLakeLaogai;