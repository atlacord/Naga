const { Listener } = require('axoncore');
const { Tatsu } = require('tatsu');
const profile = require('../../../Models/Profile');

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

    displayName(member) {
        return member.nick ?? member.user.username;
    }

    async execute(msg) {
        let tatsuProfile = await tatsu.getMemberRanking('370708369951948800', msg.author.id);
        profile.findById(msg.author.id, async (err, doc) => {

            if (!doc) {
                doc = new profile({ _id: msg.author.id })
            }
            // let level = tatsuProfile.score;
            let calcXp;
            console.log(tatsuProfile.score);
            for (let i = 0; i <= 30; i += 1) {
                calcXp = tatsuProfile.score + i;
                if (Object.values(this.levels).includes(calcXp)) {
                    let level = this.getKeyByValue(this.levels, calcXp);
                    doc.data.level = level;
                    if (doc.data.level !== level) {
                        // msg.channel.createMessage(`Flameo, **${this.displayName(msg, msg.member)}**! You just reached **level ${level}**!`);
                        let c = await this.bot.getChannel('918700274632245288');
                        console.log(`This is a level up for ${msg.author.id}`);
                        doc.save().then(() => c.createMessage(`Flameo **${this.displayName(msg.member)}**, you just advanced to **level ${level}**!`), console.log(msg.author.id, doc.data.level));
                        continue;
                    }
                }
            }
        })
        // let arr = Array.from(new Array(100), (x, i) => i + -100);
    }
}

module.exports = LevelUp;
