const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const db = require('../../../Models/Profile');
const moment = require('moment');

const GUILD_ID = '370708369951948800';
const BIRTHDAY_ROLE = '787644908705153024'

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

    async checkBirthday() {
        let birthdayMentions = [];
        const announcementChannel = '372087095121936385';
        
        try {

            let inRoles, outRoles = ['787644908705153024'];

		    let members = guild.members.filter(m =>
            inRoles.filter(r => m.roles.includes(r.id)).length === inRoles.length);
            members = members.filter(m => outRoles.filter(r => m.roles.includes(r.id)).length === 0);

            for (let x in members) {
                this.bot.removeGuildMemberRole(GUILD_ID, member, BIRTHDAY_ROLE, 'Birthday ended');
                console.log(`[Birthday] Birthday role (should have been) removed from ${doc._id}.`);
            }

            db.find({ 'data.profile.birthday': moment().format('Do MMMM') }, async (err, docs) => {
                console.log(moment().format('Do MMMM'));
            const members = docs.map(x => x._id);
            console.log(docs)

            for (let i in members) {
                this.executeBirthday(members[i], birthdayMentions);
            }
        })

            let embed = {
                title: 'Happy Birthday!',
                color: parseInt('f294f3', 16),
                description: `Don't worry, the captain cares enough to remember the birthday(s) of ${birthdayMentions.join(', ')}!\n\nWishing you a very happy birthday! Welcome to the Pink Lotus!`,
                thumbnail: { url: 'https://cdn.discordapp.com/emojis/887756769865109546.png?v=1' },
                image: { url: 'https://cdn.discordapp.com/attachments/411903716996677639/890018048298332160/happy-birthday-avatar.gif' }
            }
            if (birthdayMentions.length >= 1) {
                await this.bot.getChannel(announcementChannel).createMessage({embed});
            }
        } catch (err) {
            console.error(err);
        }
    }

    // async scheduleRemoval(member) {
    //     await this.utils.delayFor(86400000);
    //     this.bot.removeGuildMemberRole('370708369951948800', member, '787644908705153024', 'Birthday ended');
    // }

    async executeBirthday(member, mentions) {
        db.findById((member), (err, doc) => {
            if (this.bot.guilds.get(GUILD_ID).members.has(member)) {
                mentions.push(`<@!${member}>`);
                this.bot.addGuildMemberRole(GUILD_ID, member, BIRTHDAY_ROLE, 'Temporary birthday role');
                doc.data.birthdayTimestamp = Date.now();
                console.log(`[Birthday] Birthday role assigned to ${doc._id} at ${doc.data.birthdayTimestamp}`);
            }
        doc.save().catch((err), this.logger.error(err.stack));
        })
        console.log(mentions);
        return mentions;
    }


    async execute() {
        this.checkBirthday()
    }
}

module.exports = CheckBirthday