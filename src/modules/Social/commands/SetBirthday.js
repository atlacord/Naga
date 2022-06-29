const { Command, CommandOptions } = require('axoncore');
const moment = require('moment');
const profile = require('../../../Models/Profile');

class SetBirthday extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'setbirthday';
        this.aliases = [
            'setbday'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'birthday',
            description: 'Update your server birthday!',
            usage: 'setbirthday 20-04',
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
            if (err) {
                return this.sendError(msg.channel, `DB Error: ${err}`)
            } else if (!doc) {
                doc = new profile({ _id: msg.author.id });
            };

            let date = moment (args[0], 'DD-MM');

            if (!date.isValid()){
                return this.sendError(msg.channel, 'Please send the date in DD-MM format.');
            };
            
            doc.data.profile.birthday = date.format('Do MMMM');
            
            doc.save()
            .then(() => this.sendSuccess(msg.channel, `Your birthday has been updated to ${doc.data.profile.birthday}`))
            .catch((err) => this.sendError(msg.channel, `Birthday update failed: ${err}`));
        });
    }
}

module.exports = SetBirthday;

