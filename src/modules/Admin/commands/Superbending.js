const { Command, CommandOptions, CommandPermissions } = require('axoncore');

// const userRegex = /<@([^}]+)>/g;

class Superbending extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'superbending';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'superbending',
            description: 'Assigns initial members to superbending roles',
            usage: 'superbending',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 1000,
            guildOnly: true,
        });

        this.roles = {
            nonbender: '372093851600683011',
            waterbender: '372085492910522370',
            earthbender: '372085752319967236',
            firebender: '372085669142724608',
            airbender: '372085326165835777',
        }

        this.superroles = {
            water: '1180969376770441298',
            earth: '1180969390049607791',
            fire: '1180969386245378058',
            air: '1180969398048129166',
            non: '1180969393841242194'
        }

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        });
    };

    checkRoles(array, values) {
        let res;
        for (let i in values) {
            if (array.includes(values[i]) === true) {
                res = true;
                break;
            } else {
                res = false;
            }
        }
        return res;
    };

    async execute() {
      try {
        let members = this.bot.guilds.get('370708369951948800').members.filter(m =>
            (m.roles.includes('811411225639518209')));
            for (let i in members) {
                let member = members[i];
                if (this.checkRoles(member.roles, [ this.roles.water ])) {
                    guild.addMemberRole(member.id, this.superroles.water, 'Added super-waterbending role');
                };

                if (this.checkRoles(member.roles, [ this.roles.earth ])) {
                    guild.addMemberRole(member.id, this.superroles.earth, 'Added super-earthbending role');
                };

                if (this.checkRoles(member.roles, [ this.roles.fire ])) {
                    guild.addMemberRole(member.id, this.superroles.fire, 'Added super-firebending role');
                };

                if (this.checkRoles(member.roles, [ this.roles.air ])) {
                    guild.addMemberRole(member.id, this.superroles.air, 'Added super-airbending role');
                };

                if (this.checkRoles(member.roles, [ this.roles.non ])) {
                    guild.addMemberRole(member.id, this.superroles.non, 'Added super-nonbending role');
                };
            }
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}

module.exports = Superbending;
