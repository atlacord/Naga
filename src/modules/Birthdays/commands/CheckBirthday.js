const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const db = require('../../../Models/Profile');
const cron = require('node-cron');
const moment = require('moment');

class CheckBirthday extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'checkbirthday';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'checkbirthday',
            description: 'Check birthday',
            usage: 'checkbirthday',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    checkBirthday(msg) {
        let birthdayMentions = [];
        const announcementChannel = '983618760525090869'
        try {
            db.find({ 'data.profile.birthday': moment().format('Do MMMM') }, async (err, docs) => {
            const members = docs.map(x => x._id);

            for (let i in members) {
                birthdayMentions.push(`<@!${members[i]}>`);
                this.bot.addGuildMemberRole('370708369951948800', members[i], '787644908705153024', 'Testing birthday feature');
                this.scheduleRemoval(members[i]);
            }

            let embed = {
                title: 'Happy Birthday!',
                color: parseInt('f294f3', 16),
                description: `Don't worry, the captain cares enough to remember the birthday(s) of ${birthdayMentions.join(', ')}!\n\nWishing you a very happy birthday! Welcome to the Pink Lotus!`,
                thumbnail: { url: 'https://cdn.discordapp.com/emojis/887756769865109546.png?v=1' },
                image: { url: 'https://cdn.discordapp.com/attachments/411903716996677639/890018048298332160/happy-birthday-avatar.gif' }
            }

            this.sendMessage(announcementChannel, {embed});
            })
        } catch (err) {
            this.utils.logError(msg, err);
        }
    }

    async scheduleRemoval(member) {
        await this.utils.delayFor(86400000 );
        this.bot.removeGuildMemberRole('370708369951948800', member, '787644908705153024', 'Birthday ended');
    }

    scheduleJob() {
        cron.schedule('*/1 * * * *', () => {
            this.execute()
            console.log('Checking for new birthdays');
        })
    };

    async execute({ msg }) {
        this.checkBirthday(msg)
    }
}

module.exports = CheckBirthday