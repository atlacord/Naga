const {Command, CommandOptions, CommandPermissions} = require('axoncore');

class LoadPermissions extends Command {
    constructor(module) {
        super(module);

        this.label = 'loadpermissions';
        this.aliases = ['lp, loadperms'];

        this.info = {
            name: 'loadperms',
            description: 'Loads staff permissions into Naga config (happens automatically on startup',
            usage: 'loadperms',
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
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    log(member) {
        return console.info(`Loading permissions for ${this.utils.fullName(member)} (${member.id})`)
    }

    async initPerms() {
        let bushy = await this.bot.getRESTUser('283451169152696320');
        let bo = await this.bot.getRESTUser('260600155630338048')

        let admins = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes('372084219423490049')));
            for (let i in admins) {
                this.log(admins[i]);
                this.axon.staff.admins.push(admins[i].id);
                this.axon.staff.sentries.push(admins[i].id);
                this.axon.staff.dailis.push(admins[i].id);
            }
            this.log(bushy);
            this.log(bo);
            this.axon.staff.admins.push(bushy.id, bo.id);
            this.axon.staff.sentries.push(bushy.id, bo.id);
            this.axon.staff.dailis.push(bushy.id, bo.id);

        let srmods = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes('1182448979288527029')));
            for (let i in srmods) {
                this.log(srmods[i]);
                this.axon.staff.sentries.push(srmods[i].id);
                this.axon.staff.dailis.push(srmods[i].id);
            }

        let mods = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes('1182449762583191592')));
            for (let i in mods) {
                this.log(mods[i]);
                this.axon.staff.dailis.push(mods[i].id);
            }
    }
    
    async execute() {
        await this.initPerms();
    }
}

module.exports = LoadPermissions;