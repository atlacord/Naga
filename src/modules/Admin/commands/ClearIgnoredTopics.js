const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { readFileSync, writeFileSync } = require('fs');

// const userRegex = /<@([^}]+)>/g;

class ClearIgnoredTopics extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'cit';
        this.aliases = ['cit'];

        this.hasSubcmd = false;

        this.info = {
            name: 'cit',
            description: 'Clears ignored topics',
            usage: 'cit',
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
                needed: this.axon.staff.owner,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    async execute({ msg }) {
        writeFileSync('src/assets/IgnoredTopics.json', JSON.stringify([]));
        writeFileSync('src/assets/IgnoredATLATopics.json', JSON.stringify([]));
        writeFileSync('src/assets/IgnoredKorraTopics.json', JSON.stringify([]));
    }
}

module.exports = ClearIgnoredTopics;