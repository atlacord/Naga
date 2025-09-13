const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { readFileSync, writeFileSync } = require('fs');
// const axios = require('axios');
const server = require('../../../Models/Server');

const COMMAND_COOLDOWN = 600000;

class ATLA extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'atla';
        this.aliases = [ 'atla' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'topic atla',
            description: 'Provides a random topic about ATLA!',
            usage: 'topic atla',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: null,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            channels: {
                bypass: ['372086844956868618', '721604232532459540', '1008421501487304844']
            }
        });
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    handleCooldown(timestamp) {
        const timeLeft = Date.now() - timestamp;
        if (timeLeft <= COMMAND_COOLDOWN) {
            let time = Math.ceil((600000 - timeLeft) / 100) / 10
            let minutes = Math.floor(time / 60);
            let seconds = Math.ceil(time - minutes * 60);
            if (minutes === 0) {
                return `${seconds} sec`;
            } else {
                return `${minutes} minutes ${seconds} seconds`;
            }
        } else return false;
    }

    async execute({ msg, executionType }) {
        server.findById(msg.guildID, (err, doc) => {

            // let atlatopics = await axios.get('http://atla.sh/topics.json');
            // atlatopics = atlatopics.data;

            if (executionType !== 2) {
                let timeRemaining = this.handleCooldown(doc.data.topicTimestamps.atla);
                if (timeRemaining !== false) {
                    return this.sendError(msg.channel, `This command has already been used recently!\nTry again in **${timeRemaining}**!`);
                };
            };

            const atlatopics = doc.data.atlaTopics;

            let topic = Math.floor(Math.random() * atlatopics.length);

            if (doc.data.ignoredATLATopics.length >= atlatopics.length) {
                doc.data.ignoredATLATopics = [];
            }

            while (doc.data.ignoredATLATopics.includes(topic)) {
                topic = Math.floor(Math.random() * atlatopics.length);
            };

            return this.sendMessage(msg.channel, {
                embed: {
                    color: this.utils.getColor('blue'),
                    description: atlatopics[topic],
                    footer: { text: `Topic ${topic}` }
                }
            }).then(doc.data.ignoredATLATopics.push(topic), doc.data.topicTimestamps.atla = msg.createdAt, doc.save());
        });
    }
}


module.exports = ATLA;

