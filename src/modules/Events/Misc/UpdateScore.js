const { Listener } = require('axoncore');
const { Tatsu } = require('tatsu');
const profile = require('../../../Models/Profile');

const tatsu = new Tatsu('jjyo4ESeJ0-sxQ9dSRB8zmsB8edoxVuE7');

class UpdateScore extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'updateScore';

        this.enabled = true;

        this.info = {
            description: 'Updates Naga xp in database based on Tatsu XP',
        };

        this.levels = require('../../../assets/levels');
    }

    async execute(msg) {
        if (msg.author.bot) return;
        try {
            console.log('Score update in progress...');
            let tatsuProfile = await tatsu.getMemberRanking('370708369951948800', msg.author.id);
            profile.findById(msg.author.id, async (err, doc) => {
                if (!doc) {
                    doc = new profile({ _id: msg.author.id })
                };

                let score = tatsuProfile.score;

                let level;
                switch (true) {
                    case (score < this.levels[1]):
                        level = 0;
                        break;
                    case (score < this.levels[2]):
                        level = 1;
                        break;
                    case (score < this.levels[3]):
                        level = 2;
                        break;
                    case (score < this.levels[4]):
                        level = 3;
                        break;
                    case (score < this.levels[5]):
                        level = 4;
                        break;
                    case (score < this.levels[6]):
                        level = 5;
                        break;
                    case (score < this.levels[7]):
                        level = 6;
                        break;
                    case (score < this.levels[8]):
                        level = 7;
                        break;
                    case (score < this.levels[9]):
                        level = 8;
                        break;
                    case (score < this.levels[10]):
                        level = 9;
                        break;
                    case (score < this.levels[11]):
                        level = 10;
                        break;
                    case (score < this.levels[12]):
                        level = 11;
                        break;
                    case (score < this.levels[13]):
                        level = 12;
                        break;
                    case (score < this.levels[14]):
                        level = 13;
                        break;
                    case (score < this.levels[15]):
                        level = 14;
                        break;
                    case (score < this.levels[16]):
                        level = 15;
                        break;
                    case (score < this.levels[17]):
                        level = 16;
                        break;
                    case (score < this.levels[18]):
                        level = 17;
                        break;
                    case (score < this.levels[19]):
                        level = 18;
                        break;
                    case (score < this.levels[20]):
                        level = 19;
                        break;
                    case (score < this.levels[21]):
                        level = 20;
                        break;
                    case (score < this.levels[22]):
                        level = 21;
                        break;
                    case (score < this.levels[23]):
                        level = 22;
                        break;
                    case (score < this.levels[24]):
                        level = 23;
                        break;
                    case (score < this.levels[25]):
                        level = 24;
                        break;
                    case (score < this.levels[26]):
                        level = 25;
                        break;
                    case (score < this.levels[27]):
                        level = 26;
                        break;
                    case (score < this.levels[28]):
                        level = 27;
                        break;
                    case (score < this.levels[29]):
                        level = 28;
                        break;
                    case (score < this.levels[30]):
                        level = 29;
                        break;
                    case (score < this.levels[31]):
                        level = 30;
                        break;
                    case (score < this.levels[32]):
                        level = 31;
                        break;
                    case (score < this.levels[33]):
                        level = 32;
                        break;
                    case (score < this.levels[34]):
                        level = 33;
                        break;
                    case (score < this.levels[35]):
                        level = 34;
                        break;
                    case (score < this.levels[36]):
                        level = 35;
                        break;
                    case (score < this.levels[37]):
                        level = 36;
                        break;
                    case (score < this.levels[38]):
                        level = 37;
                        break;
                    case (score < this.levels[39]):
                        level = 38;
                        break;
                    case (score < this.levels[40]):
                        level = 39;
                        break;
                    case (score < this.levels[41]):
                        level = 40;
                        break;
                    case (score < this.levels[42]):
                        level = 41;
                        break;
                    case (score < this.levels[43]):
                        level = 42;
                        break;
                    case (score < this.levels[44]):
                        level = 43;
                        break;
                    case (score < this.levels[45]):
                        level = 44;
                        break;
                    case (score < this.levels[46]):
                        level = 45;
                        break;
                    case (score < this.levels[47]):
                        level = 46;
                        break;
                    case (score < this.levels[48]):
                        level = 47;
                        break;
                    case (score < this.levels[49]):
                        level = 48;
                        break;
                    case (score < this.levels[50]):
                        level = 49;
                        break;
                    case (score < this.levels[51]):
                        level = 50;
                        break;
                    case (score < this.levels[52]):
                        level = 51;
                        break;
                    case (score < this.levels[53]):
                        level = 52;
                        break;
                    case (score < this.levels[54]):
                        level = 53;
                        break;
                    case (score < this.levels[55]):
                        level = 54;
                        break;
                    case (score < this.levels[56]):
                        level = 55;
                        break;
                    case (score < this.levels[57]):
                        level = 56;
                        break;
                    case (score < this.levels[58]):
                        level = 57;
                        break;
                    case (score < this.levels[59]):
                        level = 58;
                        break;
                    case (score < this.levels[60]):
                        level = 59;
                        break;
                    case (score < this.levels[61]):
                        level = 60;
                        break;
                    case (score < this.levels[62]):
                        level = 61;
                        break;
                    case (score < this.levels[63]):
                        level = 62;
                        break;
                    case (score < this.levels[64]):
                        level = 63;
                        break;
                    case (score < this.levels[65]):
                        level = 64;
                        break;
                    case (score < this.levels[66]):
                        level = 65;
                        break;
                    case (score < this.levels[67]):
                        level = 66;
                        break;
                    case (score < this.levels[68]):
                        level = 67;
                        break;
                    case (score < this.levels[69]):
                        level = 68;
                        break;
                    case (score < this.levels[70]):
                        level = 69;
                        break;
                    case (score < this.levels[71]):
                        level = 70;
                        break;
                    case (score < this.levels[72]):
                        level = 71;
                        break;
                    case (score < this.levels[73]):
                        level = 72;
                        break;
                    case (score < this.levels[74]):
                        level = 73;
                        break;
                    case (score < this.levels[75]):
                        level = 74;
                        break;
                    case (score < this.levels[76]):
                        level = 75;
                        break;
                    case (score < this.levels[77]):
                        level = 76;
                        break;
                    case (score < this.levels[78]):
                        level = 77;
                        break;
                    case (score < this.levels[79]):
                        level = 78;
                        break;
                    case (score < this.levels[80]):
                        level = 79;
                        break;
                    case (score < this.levels[81]):
                        level = 80;
                        break;
                    case (score < this.levels[82]):
                        level = 81;
                        break;
                    case (score < this.levels[83]):
                        level = 82;
                        break;
                    case (score < this.levels[84]):
                        level = 83;
                        break;
                    case (score < this.levels[85]):
                        level = 84;
                        break;
                    case (score < this.levels[86]):
                        level = 85;
                        break;
                    case (score < this.levels[87]):
                        level = 86;
                        break;
                    case (score < this.levels[88]):
                        level = 87;
                        break;
                    case (score < this.levels[89]):
                        level = 88;
                        break;
                    case (score < this.levels[90]):
                        level = 89;
                        break;
                    case (score < this.levels[91]):
                        level = 90;
                        break;
                    case (score < this.levels[92]):
                        level = 91;
                        break;
                    case (score < this.levels[93]):
                        level = 92;
                        break;
                    case (score < this.levels[94]):
                        level = 93;
                        break;
                    case (score < this.levels[95]):
                        level = 94;
                        break;
                    case (score < this.levels[96]):
                        level = 95;
                        break;
                    case (score < this.levels[97]):
                        level = 96;
                        break;
                    case (score < this.levels[98]):
                        level = 97;
                        break;
                    case (score < this.levels[99]):
                        level = 98;
                        break;
                    case (score < this.levels[100]):
                        level = 99;
                        break;
                    case (score < this.levels[101]):
                        level = 100;
                        break;
                }

                doc.data.global_xp = score;
                doc.data.global_level = level;
                return doc.save().then(() => console.log(`Updated score for ${msg.author.id}. New score: ${doc.data.global_xp}, New level: ${doc.data.global_level}`));
            });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = UpdateScore;