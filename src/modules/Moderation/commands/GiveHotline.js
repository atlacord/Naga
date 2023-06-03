const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const profile = require('../../../Models/Profile');

class SendHotline extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'sendhotline';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'sendhotline',
            description: 'Gives the Self Care Resources role to a member',
            usage: 'sendhotline [member',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 5000,
            guildOnly: true,
        });

        /**
         * @type {CommandPermissions}
        */
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.dailis,
                bypass: this.axon.staff.owners,
            },
        });
    }

     /**
     * @param {import('axoncore').CommandEnvironment} env
     */

      async execute({ msg, args }) {
        try {
            const guild = msg.channel.guild;

            const member = this.utils.resolveUser(guild, args[0]);
            profile.findById(member.id, async (err, doc) => {
                const roles = [...member.roles];

                if (!doc) {
                    doc = new profile({ _id: member.id });
                }

                if (roles.includes('388121551779921930')) {
                    doc.data.flags.push('SERIOUS_LOCK');
                    await guild.removeMemberRole(member.id, '388121551779921930');
                }

                await guild.addMemberRole(member.id, '1106789319240335460', 'Given access to self-care resources');
                doc.save().then(() => this.sendSuccess(msg.channel, `Added ${member.username}#${member.discriminator} to the self-care resources channel.`));
            });
        } catch (err) {
            this.sendError(msg.channel, err);
        }
    }   
}

module.exports = SendHotline;