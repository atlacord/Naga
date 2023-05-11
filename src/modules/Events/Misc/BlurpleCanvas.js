const { Listener } = require('axoncore');

const BLURPLE_ROLE = '1106341185229951016';
const profile = require('../../../Models/Profile');

class BlurpleCanvas extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'blurpleCanvas';

        this.enabled = true;

        this.info = {
            description: 'Grants a role to users who participate in Blurple Canvas',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(msg) { // eslint-disable-line
        if (msg.author.bot) return;
        profile.findById(msg.author.id, (err, doc) => {
            if (!doc) {
                doc = new profile({ _id: msg.author.id });
                console.log(`[DatabaseManager] Profile created for ${this.utils.fullName(msg.author)}`);
            }
            if ((msg.content.startsWith('p/place')) && ((msg.channel.id === '1105276831340433438') || (msg.channel.id === '372087473892884502'))) {//'—ban' || '--ban')) {
                doc.data.flags.push('BLURPLE_ARTIST_2022'),
                msg.channel.guild.addMemberRole(msg.author.id, BLURPLE_ROLE, 'Participated in Blurple Canvas 2022')
            }
            doc.save();
        });
    }
}

module.exports = BlurpleCanvas;
