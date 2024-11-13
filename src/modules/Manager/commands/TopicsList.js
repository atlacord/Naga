const { Command, CommandPermissions } = require('axoncore');
const server = require('../../../Models/Server.js');
const embedPaginator = require('eris-pagination');

class TopicsList extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'topicslist';
        this.aliases = [ 'topiclist' ];

        this.info = {
            name: 'topicslist',
            description: 'Shows all of the available topics.',
            usage: 'topicslist',
        };

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: [...this.axon.staff.dailis, ...this.axon.staff.sentries, ...this.axon.staff.admins],
                bypass: this.axon.staff.owners,
            },
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg }) {
      server.findById(msg.guildID, async (err, doc) => {
        if (err) {
            return this.sendError(msg.channel, `An error occurred: ${err}`);
        }

        const topics = doc.data.topics.map((joinMsg, index) => `**${index + 1}:** ${joinMsg}`);
        const numberOfPages = Math.ceil(topics.length / 50);

        let embeds = [];

        let startingIndex = 0;
        for (let i=0; i < numberOfPages; i++) {
            let topicsOnPage = topics.slice(startingIndex, startingIndex + 50);
            startingIndex += 50; // starting point for next iteration

            embeds.push({ 
                color: this.utils.getColor('blue'), 
                title: 'Current Topics',
                description: topicsOnPage.join('\n'),
                timestamp: new Date().toISOString()
            });
        }

        embedPaginator.createPaginationEmbed(msg, embeds, { timeout: 180000, cycling: true }); // 3 minute timeout
      });
    }
}

module.exports = TopicsList;

