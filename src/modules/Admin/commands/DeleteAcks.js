const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const profile = require('../../../Models/Profile');

// const userRegex = /<@([^}]+)>/g;

class DeleteAcks extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'delacks';
        this.aliases = ['deleteacks', 'delack'];

        this.hasSubcmd = false;

        this.info = {
            name: 'delacks',
            description: 'Removes a member acknowledgement from their profile',
            usage: 'delacks [member] [acknowledgement]',
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

            let index = doc.data.profile.acks.indexOf(args.join(' '));
    
            if (index > -1) {
                doc.data.profile.acks.splice(index, 1)
            };
            doc.save().then(() => this.sendSuccess(msg.channel, `Removed acknowledgement from ${this.utils.fullName(m)}'s profile.`)
            .catch((err) => this.sendError(msg.channel, err)));
        });
    }
}

module.exports = DeleteAcks;