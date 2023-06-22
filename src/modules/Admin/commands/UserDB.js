const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { Tatsu } = require('tatsu');
const profile = require('../../../Models/Profile');

const tatsu = new Tatsu('jjyo4ESeJ0-sxQ9dSRB8zmsB8edoxVuE7');

// const userRegex = /<@([^}]+)>/g;

class UserDB extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'mp';
        this.aliases = ['mp'];

        this.hasSubcmd = false;

        this.info = {
            name: 'mp',
            description: 'Migrate member levels',
            usage: 'mp',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 1000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    async execute({msg, args}) {
        let m = this.utils.resolveUser(msg.channel.guild, args.join(' '));
        profile.findById(m.id, async (err, doc) => {
            msg.channel.createMessage(`\`\`\`js\n${JSON.stringify(doc)}\`\`\``);
        });
    }
}

module.exports = UserDB;