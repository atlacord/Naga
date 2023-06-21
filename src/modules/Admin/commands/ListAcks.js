const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const profile = require('../../../Models/Profile');

// const userRegex = /<@([^}]+)>/g;

class ListAcks extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'listacks';
        this.aliases = ['viewacks'];

        this.hasSubcmd = false;

        this.info = {
            name: 'listacks',
            description: 'Displays acknowledgements for a member',
            usage: 'listacks [member]',
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
        profile.findById(args[0], async (err, doc) => {
            let embed = {
                color: this.utils.getColor('blue'),
                author: { name: this.utils.fullName(m), icon_url: m.user.avatarURL },
                description: `Acknowledgements [${doc.data.profile.acks.length}]:\n${doc.data.profile.acks.join(', ')}`
            };

            msg.channel.createMessage({embed})
        });
    }
}

module.exports = ListAcks;