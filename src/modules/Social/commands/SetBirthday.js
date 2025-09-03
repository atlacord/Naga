const { Command, CommandOptions, CommandPermissions } = require('axoncore');
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
            'setbday',
            'birthday'
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
            // cooldown: 5000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            channels: {
                needed: ['372087473892884502', '411903716996677639'] // #bot-commands and #bot-interface
            }
        });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {
        profile.findById(msg.author.id, (err, doc) => {
            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');
            } else if (!doc) {
                doc = new profile({ _id: msg.author.id });
            };

            let date = moment(args.join('-'), 'DD-MM');

            if (!date.isValid()){
                return this.sendError(msg.channel, 'Please send the date in DD-MM format.');
            };
            
            doc.data.profile.birthday = date.format('Do MMMM');
            
            doc.save()
            .then(() => this.sendSuccess(msg.channel, `Your birthday has been updated to ${doc.data.profile.birthday}`))
            .catch((err) => this.utils.logError(msg, err, 'internal', 'Birthday update failed'));
        });
    }
}

module.exports = SetBirthday;

