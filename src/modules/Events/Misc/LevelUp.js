const { Listener } = require('axoncore');
const { Tatsu } = require('tatsu');

const tatsu = new Tatsu('jjyo4ESeJ0-sxQ9dSRB8zmsB8edoxVuE7');

// const userRegex = /<@([^}]+)>/g;

class LevelUp extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'activityAnalytics-LevelUpMessages';

        this.enabled = true;

        this.info = {
            description: 'Flameo messages for individual xp values (equal to carl levels)',
        };

        this.levels = require('../../../assets/levels');
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    displayName(message, member) {
        return (message).channel.guild.members.get(member).nick ?? (message).channel.guild.members.get(member).username;
    }

    async execute(msg) {
        let profile = await tatsu.getMemberRanking('370708369951948800', msg.author.id);
        // let level = profile.score;
        let calcXp;
        for (let i = 0; calcXp = profile.score + i; i += 1) {
            if (Object.values(this.levels).includes(calcXp)) {
                let level = this.getKeyByValue(this.levels, calcXp);
                // msg.channel.createMessage(`Flameo, **${this.displayName(msg, msg.member)}**! You just reached **level ${level}**!`);
                console.log(`${this.displayName(msg, msg.member)} just reached level ${level}!`);
                break;
            }
        }
        // let arr = Array.from(new Array(100), (x, i) => i + -100);
    }
}

module.exports = LevelUp;