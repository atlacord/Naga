const { Command, CommandPermissions, CommandOptions } = require('axoncore');

class Staff extends Command {
    constructor(module) {
        super(module);

        this.label = 'staff';
        this.aliases = [
            'liststaff',
            'nagaperms'
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
        let moverstar = [];
        let loa = [];

        // for (let admin = 0; admin < this.axon.staff.admins.length; admin += 1) {
        //     let member = await this.bot.getRESTUser(this.axon.staff.admins[admin]);
        //     wl.push(`${member.username}#${member.discriminator}`);
        // }

        // let index = wl.indexOf('283451169152696320');
        // wl.splice(index, 1)
        // index = wl.indexOf('260600155630338048')
        // wl.splice(index, 1)

        // for (let sentry = 0; sentry < this.axon.staff.sentries.length; sentry += 1) {
        //     if (!this.axon.staff.admins.includes(this.axon.staff.sentries[sentry])) {
        //         let member = await this.bot.getRESTUser(this.axon.staff.sentries[sentry]);
        //         sentries.push(`${member.username}#${member.discriminator}`)
        //     }
        // }

        // for (let mod = 0; mod < this.axon.staff.dailis.length; mod += 1) {
        //     let member = await this.bot.getRESTUser(this.axon.staff.dailis[mod]);
        //     daili.push(`${member.username}#${member.discriminator}`)
        // }

        let admins = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes('372084219423490049'))); // White Lotus
            for (let i in admins) {
                let member = await this.bot.getRESTUser(admins[i].id);
                wl.push(this.utils.fullName(member));
            }

        let srmods = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes('1182448979288527029') && (!m.roles.includes('372084219423490049')))); // Sentry
            for (let i in srmods) {
                let member = await this.bot.getRESTUser(srmods[i].id);
                sentries.push(this.utils.fullName(member));
            }

        let mods = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes('1182449762583191592') && (!m.roles.includes('372084219423490049')))); // Dai Li
            for (let i in mods) {
                let member = await this.bot.getRESTUser(mods[i].id);
                daili.push(this.utils.fullName(member));
            }

        let moverstars = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes('1182449762583191592') && (!m.roles.includes('1224072458206711928')))); // Mover Star
            for (let i in moverstars) {
                let member = await this.bot.getRESTUser(moverstars[i].id);
                moverstar.push(this.utils.fullName(member));
            }
        
        let loastaff = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes('1014357399206899732'))); // Vacation Tenzin
            for (let i in loastaff) {
                let member = await this.bot.getRESTUser(loastaff[i].id);
                loa.push(this.utils.fullName(member));
            }

        this.bot.guilds.get('370708369951948800').roles.get('')

        let embed = {
            color: this.utils.getColor('blue'),
            author: { name: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
            fields: [
                { name: `White Lotus [${wl.length}]`, value: wl.join('\n') },
                { name: `Sentries [${sentries.length}]`, value: sentries.join('\n') },
                { name: `Dai Li [${daili.length}]`, value: daili.join('\n') },
                { name: `Mover Stars [${moverstar.length}]`, value: moverstar.join('\n')},
                { name: `Vacation Tenzin - LOA [${loa.length}]`, value: loa.join('\n') }
            ],
            footer: { text: `Total: ${Math.floor(wl.length + sentries.length + daili.length + moverstar.length)}` }
        }

        this.sendMessage(msg.channel, {embed});
    }
}

module.exports = Staff;