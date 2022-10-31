const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { Tatsu } = require('tatsu');
const messages = require('../../../assets/joinmessages.json');
const config = require('../../../../configs/config.json');
const { readFileSync, writeFileSync } = require('fs');

const tatsu = new Tatsu('jjyo4ESeJ0-sxQ9dSRB8zmsB8edoxVuE7');

// const userRegex = /<@([^}]+)>/g;

class Configure extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'configure';
        this.aliases = ['config'];

        this.hasSubcmd = false;

        this.info = {
            name: 'configure',
            description: 'Enable/disable various settings',
            usage: 'configure [setting] [true/false]',
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
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    async execute({ msg, args }) {
        if (!args) {
            msg.channel.createMessage({}, { embed: {
                title: 'Configuration Settings',
                color: this.utils.getColor('blue'),
                description: 'joinMessages\ndebugMode (disables Naga for normal users)'
            }})
        } else {
            config.settings[args[0]] = args[1];
            switch (config.settings[args[0]]) {
                case true:
                    this.sendSuccess(msg.channel, `Enabled ${args[0]}.`);
                    break;
                case false:
                    this.sendSuccess(msg.channel, `Disabled ${args[0]}`);
                    break;
            }
            console.log(config.settings[args[0]])
        }
    }
}

module.exports = Configure;