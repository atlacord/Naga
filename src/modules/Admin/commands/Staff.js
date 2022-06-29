const { Command, CommandPermissions, CommandOptions } = require('axoncore');

class Staff extends Command {
    constructor(module) {
        super(module);

        this.label = 'staff';
        this.aliases = [
            'liststaff'
        ];

        this.info = {
            name: 'staff',
            description: 'List staff team',
            usage: 'staff',
        };

      /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: null,
            hidden: true,
        } );
        
        /**
         * @type {CommandPermissions}
         */
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg }) {

        let wl = [];
        let sentries = [];
        let daili = [];
        let honorarywl = [];

        for (let admin = 0; admin < this.axon.staff.admins.length; admin += 1) {
            let member = await this.bot.getRESTUser(this.axon.staff.admins[admin]);
            wl.push(`${member.username}#${member.discriminator}`);
        }

        let index = wl.indexOf('283451169152696320');
        wl.splice(index, 1)
        index = wl.indexOf('260600155630338048')
        wl.splice(index, 1)

        let bushy = await this.bot.getRESTUser('283451169152696320');
        let bo = await this.bot.getRESTUser('260600155630338048')
        honorarywl.push(`${bushy.username}#${bushy.discriminator}`, `${bo.username}#${bo.discriminator}`)

        for (let sentry = 0; sentry < this.axon.staff.sentries.length; sentry += 1) {
            let member = await this.bot.getRESTUser(this.axon.staff.sentries[sentry]);
            sentries.push(`${member.username}#${member.discriminator}`)
        }

        for (let mod = 0; mod < this.axon.staff.dailis.length; mod += 1) {
            let member = await this.bot.getRESTUser(this.axon.staff.dailis[mod]);
            daili.push(`${member.username}#${member.discriminator}`)
        }

        let embed = {
            color: this.utils.color.blue,
            author: { name: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
            fields: [
                { name: 'White Lotus', value: wl.join('\n') },
                { name: 'Lotus Emeritus', value: honorarywl.join('\n')},
                { name: 'Sentries', value: sentries.join('\n') },
                { name: 'Dai Li', value: daili.join('\n') }
            ]
        }

        this.sendMessage(msg.channel, {embed});
    }
}

module.exports = Staff;