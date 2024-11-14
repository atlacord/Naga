const { Command, CommandPermissions } = require('axoncore');
const server = require('../../../../Models/Server.js');
const embedPaginator = require('eris-pagination');

class List extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'list';

        this.info = {
            name: 'joinmsgs list',
            description: 'Shows all of the join messages.',
            usage: 'joinmsgs list',
        };
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg }) {
      server.findById(msg.guildID, async (err, doc) => {
        if (err) {
            return this.sendError(msg.channel, `An error occurred: ${err}`);
        }

        const joinMessages = doc.data.joinMessages.map((joinMsg, index) => `**${index + 1}:** ${joinMsg}`);
        const numberOfPages = Math.ceil(joinMessages.length / 20);

        let embeds = [];

        let startingIndex = 0;
        for (let i=0; i < numberOfPages; i++) {
            let joinMsgsOnPage = joinMessages.slice(startingIndex, startingIndex + 20);
            startingIndex += 20; // starting point for next iteration

            embeds.push({ 
                color: this.utils.getColor('blue'), 
                title: 'Current Welcome Messages',
                description: joinMsgsOnPage.join('\n'),
                timestamp: new Date().toISOString()
            });
        }

        embedPaginator.createPaginationEmbed(msg, embeds, { timeout: 180000, cycling: true }); // 3 minute timeout
      });
    }
}

module.exports = List;

