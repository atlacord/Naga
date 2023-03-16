const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class DuplicateBending extends Command {

    /**
     * @param {import('axoncore').Module} module
     */

    constructor(module) {
        super(module);

        this.label = 'duplicatebending';
        this.aliases = [ 'db', 'duplicatebending' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'duplicatebending',
            description: 'Removes the Nonbender role from members who have other bending roles',
            usage: 'duplicatebending',
        };

        /**
         * @param {CommandOptions}

         */

        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        });

        this.roles = {
            nonbender: '372093851600683011',
            waterbender: '372085492910522370',
            earthbender: '372085752319967236',
            firebender: '372085669142724608',
            airbender: '372085326165835777',
            
        }
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async checkDuplicates(role) {
        let a = this.bot.guilds.get('370708369951948800').members.filter(m =>
            ((m.roles.includes(this.roles[role])) && (m.roles.includes(this.roles.nonbender))));
        let members = [];
        for (let i in a) {
            this.bot.removeGuildMemberRole('370708369951948800', a[i].id, this.roles.nonbender, 'Member had multiple bending roles, removing Nonbender');
            members.push(a[i].id);
        }
        return members.length;
    }

    async execute() {
        let c = await this.bot.getChannel('411903716996677639');
        let total = 0;
        for (let role in this.roles) {
            if (role !== 'nonbender') {
                total += await this.checkDuplicates(role);
                // console.log(`This would run the function on ${this.roles[role]}`);
            }
        }

        if (total === 0) return;
        else {
            return this.sendMessage(c, {
                embed: {
                    color: this.utils.getColor('blue'),
                    description: `Removed the Nonbender role from ${total} members with other bending roles.`,
                    timestamp: new Date(),
                }
            }), console.info(`[Server Utilities] Removed the Nonbender role from ${total} members.`);
        }
    }
}

module.exports = DuplicateBending;