const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const config = require('../../../../configs/config.json');
const server = require('../../../Models/Server');
const topics = require('../../../assets/topics.json');
const questions = require('../../../assets/wyr.json');

// const userRegex = /<@([^}]+)>/g;

class MigrateTopics extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'migratetopics';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'migratetopics',
            description: 'Migrates topics to the guild database',
            usage: 'migratetopics',
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
        server.findById('370708369951948800', (err, doc) => {
            if (!doc) {
                doc = new server({ _id: msg.guildID });
                // doc.save().then(() => this.sendSuccess(msg.channel, `Created a new guild configuration profile for ${msg.channel.guild.name}.`))
            }

            for (let i in ignoredWyrs) {
                doc.data.ignoredWyrs.push(ignoredWyrs[i]);
            }
            this.sendSuccess(msg.channel, `Successfully imported ${doc.data.ignoredWyrs.length} ignored wyr questions to the server database.`);

            doc.save();
        });
    }
}

module.exports = MigrateTopics;