const { Command, CommandOptions } = require('axoncore');
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
        this.sendMessage(msg.channel, 'fsda')
        try {
            db.find({ 'data.profile.birthday': moment().format('Do MMMM') }, async (err, docs) => {
            const members = docs.map(x => x._id);
            console.log(members[0])
            this.sendMessage(msg.channel, `<@!${members[0]}> Test`);
            this.bot.addGuildMemberRole('370708369951948800', members[0], '787644908705153024', 'Testing birthday feature')
            })
        } catch (err) {
            this.sendError(msg.channel, err);
        }
    }

    execute({ msg, args }) {
        this.checkBirthday(msg);
    }
}

module.exports = CheckBirthday