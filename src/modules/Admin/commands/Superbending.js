const { Command, CommandOptions, CommandPermissions } = require('axoncore');

// const userRegex = /<@([^}]+)>/g;

class Superbending extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'superbending';
        this.aliases = [ 'sp' ];

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

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        });
    };

    async execute({msg}) {
        msg.channel.createMessage('yass');
        try {
            let a = this.bot.guilds.get('370708369951948800').members.filter(m => ((m.roles.includes('811411225639518209'))));
            let members = [];
            for (let i in a) {
                members.push(a[i]);
            }

            for (let i in members) {
                console.log(members[i].username, members[i].roles);

                if (members[i].roles.includes('372085492910522370')) {
                    await this.bot.addGuildMemberRole('370708369951948800', member.id, '1180969376770441298', 'Added super-waterbending role');
                    console.log('water');
                };

                if (members[i].roles.includes('372085752319967236')) {
                    await this.bot.addGuildMemberRole('370708369951948800', member.id, '1180969390049607791', 'Added super-earthbending role');
                    console.log('earth');
                };

                if (members[i].roles.includes('1172722062876495963')) {
                    await this.bot.addGuildMemberRole('370708369951948800', member.id, '1180969386245378058', 'Added super-firebending role');
                    console.log('fire');
                };

                if (members[i].roles.includes('372085326165835777')) {
                    await this.bot.addGuildMemberRole('370708369951948800', member.id, '1180969398048129166', 'Added super-airbending role');
                    console.log('air');
                };

                if (members[i].roles.includes('372093851600683011')) {
                    await this.bot.addGuildMemberRole('370708369951948800', member.id, '1180969393841242194', 'Added super-nonbending role');
                    console.log('non');
                };
            };
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}

module.exports = Superbending;
