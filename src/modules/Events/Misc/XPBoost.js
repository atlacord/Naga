const { Tatsu } = require('tatsu');
const tatsu = new Tatsu(process.env.TATSU_KEY);

const { Listener } = require('axoncore');

class XPBoost extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'XPBoost';

        this.enabled = true;

        this.avatarGuild = '370708369951948800';

        this.allowedUsers = [];
        this.allowedChannels = [];
        this.allowedRoles = [];
        
        this.multipliers = {
            booster: 1.05,
            event_master: 1.03,
            staff: 1.10
        };

        this.info = {
            description: 'Experimental feature to grant XP multipliers to random users.',
        };
    }

    /**
     * @description Checks if a given member is whitelisted for the XP bonus.
     * @param {import('eris').Member} member 
     * @returns boolean
    */
    async isAllowed(m) {
        if (
            this.allowedChannels.includes(m.channel.id) ||
            this.allowedUsers.includes(m.member.id) || // checks if user is whitelisted
            this.allowedRoles.some(r => m.member.roles.includes(r))  // checks if user has a whitelisted role
        ) return true;

        // TEST FLAGS
        if (m.member.user.id.startsWith('2')) return true; // accounts created between July 2016 and April 2017.
        return false; // no whitelist? no bonus.
    }

    /**
     * @param {import('eris').Message} msg
    */
    async execute(msg) { // eslint-disable-line
        const MAX = 25;
        const MIN = 10;
        
        if (msg.author.bot) return;
        // if (!this.isAllowed) return;
        profile.findById(msg.member.id, (err, doc) => {

            let multi;
        
            if (!doc.data.xpBoost.lastMessage > Date.now() - 300) return;

            if (doc.data.xpBoost.type !== null) {
                multi = this.multipliers[doc.data.xpBoost.type];
            }
        })

        let xp = Math.floor((Math.random() * (MAX - MIN + 1) + MIN) * multi);
        await tatsu.addGuildMemberScore(this.avatarGuild, msg.author.id, xp)
        doc.data.xpBoost.lastMessage = msg.createdAt;
        doc.save();
    }
}

module.exports = XPBoost;
