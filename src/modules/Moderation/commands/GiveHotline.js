const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const profile = require('../../../Models/Profile');
const ModUtils = require('../ModUtils');

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
            usage: 'sendhotline [member]',
        };

        this.modUtils = new ModUtils();

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
                needed: [...this.axon.staff.dailis, ...this.axon.staff.sentries, ...this.axon.staff.admins],
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

                if (roles.includes('830138455337730049')) {
                    doc.data.flags.push('EVENT_MASTER_LOCK');
                    await guild.removeMemberRole(member.id, '830138455337730049');
                }

                await guild.addMemberRole(member.id, '1106789319240335460', 'Given access to self-care resources');
                doc.data.flags.push('HOTLINE_QUARANTINE');
                doc.save().then(() => this.sendSuccess(msg.channel, `Added ${this.modUtils.fullName(member.user)} to the self-care resources channel.`));
            });
        } catch (err) {
            this.sendError(msg.channel, err);
        }
    }   
}

module.exports = SendHotline;