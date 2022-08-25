const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const db = require('../../../Models/Profile');
const moment = require('moment');

class ListBirthday extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'listbirthday';
        this.aliases = [
            'listbirthdays',
            'birthdays'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'listbirthday',
            description: 'List members birthdays on any given date.',
            usage: 'listbirthday [DD-MM]',
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
                needed: this.axon.staff.sentries,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    async execute({msg, args}) {
        let date = moment(args[0], 'DD-MM');
        db.find({ 'data.profile.birthday': date.format('Do MMMM') }, async (err, docs) => {

            let members = docs.map(x => x._id);
            let birthdays = [];

            for (let i in members) {
                let user = await this.bot.getRESTUser(members[i]);
                birthdays.push(`${user.username}#${user.discriminator} (${user.id})`);
            }

            let embed = {
                author: { name: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
                color: this.utils.getColor('blue'),
                description: `**Birthdays on ${date.format('MMMM Do, YYYY')}**\n ${birthdays.join('\n')}`,
            }

            this.sendMessage(msg.channel, {embed});
        })
    }
}

module.exports = ListBirthday