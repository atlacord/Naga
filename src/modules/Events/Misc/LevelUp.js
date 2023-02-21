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
        return member.nick ?? member.username;
    }

    async execute(msg) {
        if (!msg.author.bot) {
            let tatsuProfile = await tatsu.getMemberRanking('370708369951948800', msg.author.id);
            let levelUp = false;
            let level = null;
            profile.findById(msg.author.id, (err, doc) => {
                if (!doc) {
                    doc = new profile({ _id: msg.author.id });
                    console.log(`Creating profile for ${msg.author.id}`);
                    return doc.save(function(err) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                };
                // let level = tatsuProfile.score;
                let calcXp;
                console.log(`${this.displayName(msg.member)} (${msg.author.id}) | ${doc.data.global_level}`);

                for (let i = 0; i <= 30; i += 1) {
                    calcXp = tatsuProfile.score + i;
                    if (Object.values(this.levels).includes(calcXp)) {
                        level = this.getKeyByValue(this.levels, calcXp);
                        if (doc.data.global_level !== level) {
                            levelUp = true;
                            doc.last_level_up = Date.now();
                            continue;
                        }
                    }
                }
                if ((levelUp === true) && (Date.now() - doc.last_level_up) > 10000) {
                    return doc.save(
                        function(err) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        }
                    ).then(() => msg.channel.createMessage(`Flameo **${this.displayName(msg.member)}**, you just advanced to **level ${level}**!`));
                    // msg.channel.createMessage(`Flameo, **${this.displayName(msg, msg.member)}**! You just advanced to **level ${level}**!`);
                };
            })
            // let arr = Array.from(new Array(100), (x, i) => i + -100);
        }
    }
}

module.exports = LevelUp;
