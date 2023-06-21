const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const profile = require('../../../Models/Profile');

// const userRegex = /<@([^}]+)>/g;

class AddAcks extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'addacks';
        this.aliases = ['newacks', 'addack', 'newack'];

        this.hasSubcmd = false;

        this.info = {
            name: 'addacks',
            description: 'Add a new member acknowledgement to their profile',
            usage: 'addacks [acknowledgement]',
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
        let m = this.utils.resolveUser(msg.channel.guild, args[0]);
        args.shift();
        profile.findById(m.id, async (err, doc) => {
            if (!doc) {
                doc = new profile({ _id: m.id });
            };
            doc.data.profile.acks.push(args.join(' '));
            doc.save().then(() => this.sendSuccess(msg.channel, `Added acknowledgement to ${this.utils.fullName(m)}'s profile.`)
            .catch((err) => this.sendError(msg.channel, err)));
        });
    }
}

module.exports = AddAcks;