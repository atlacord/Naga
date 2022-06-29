const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class SetBio extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);
        this.label = 'setbio';
        this.aliases = [
            'bio'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'setbio',
            description: 'Update your server bio!',
            usage: 'setbio [bio]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 5000,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg,args  }) {
        profile.findById(msg.author.id, (err, doc) => {

            try {

                doc.data.profile.bio = args.join(' ');
                doc.save();
                this.sendSuccess(msg.channel, 'Successfully updated your bio! View it with \`n.profile\`!');

            } catch (err) {
                this.sendError(msg.channel, err);
            }
        })
    }
}

module.exports = SetBio;

