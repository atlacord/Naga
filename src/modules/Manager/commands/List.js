const { Command, CommandPermissions } = require('axoncore');
const server = require('../../../Models/Server.js');
const embedPaginator = require('eris-pagination');

class List extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'list';
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, command }) {
      server.findById(msg.guildID, async (err, doc) => {
        if (err) {
            return this.sendError(msg.channel, `An error occurred: ${err}`);
        }

        let dataSet, entriesPerPage, embedTitle;
        if (command.startsWith('joinmsgs')) {
            dataSet = doc.data.joinMessages.map((joinMsg, index) => `**${index + 1}:** ${joinMsg}`);
            entriesPerPage = 20;
            embedTitle = 'Current Welcome Messages';
        } else if (command.startsWith('topics')) {
            dataSet = doc.data.topics.map((topic, index) => `**${index + 1}:** ${topic}`);
            entriesPerPage = 50;
            embedTitle = 'Current Topics'
        }

        const numberOfPages = Math.ceil(dataSet.length / entriesPerPage);

        let embeds = [];

        let startingIndex = 0;
        for (let i=0; i < numberOfPages; i++) {
            let dataOnPage = dataSet.slice(startingIndex, startingIndex + entriesPerPage);
            startingIndex += entriesPerPage; // starting point for next iteration

            embeds.push({ 
                color: this.utils.getColor('blue'), 
                title: embedTitle,
                description: dataOnPage.join('\n'),
                timestamp: new Date().toISOString()
            });
        }

        embedPaginator.createPaginationEmbed(msg, embeds, { timeout: 180000, cycling: true }); // 3 minute timeout
      });
    }
}

module.exports = List;

