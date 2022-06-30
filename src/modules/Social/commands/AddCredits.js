const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const profile = require('../../../Models/Profile');

class AddCredits extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'addcredits';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'addcredits',
            description: 'Add credits to a member',
            usage: 'addcredits [member] [amount]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 2,
            cooldown: 10000,
            guildOnly: true,
        } );

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

    async execute({ msg, args }) {
        let amount = args[1];

        profile.findById(args[0], (err, doc) => {
            let member = msg.channel.guild.members.get(args[0]);
            
            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            }

            if (member === undefined) {
                return this.sendError(msg.channel, 'Member not found. Are you using the correct user ID?');
            }

            else if (!doc || doc.data.economy.wallet === null) {
                return this.sendError(msg.channel, `Specified user does not have a wallet`);
            }
            
            else {
                doc.data.economy.wallet = doc.data.economy.wallet + Math.floor(amount);
            
                return doc.save().then(() => this.sendSuccess(msg.channel, `Successfully added **${amount}** to ${member.username}#${member.discriminator}!\nTheir new balance is **${doc.data.economy.wallet}**.`)
                .catch((err) => this.utils.logError(msg, err, 'db', 'Something went wrong.')));
            }
        })
    }
}

module.exports = AddCredits;

