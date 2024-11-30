const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { readFileSync, writeFileSync } = require('fs');
const Eris = require('eris');
// const axios = require('axios');
const topics = require('../../../assets/topics.json');
const server = require('../../../Models/Server');

const ATLA = require('./ATLA');
const Korra = require('./Korra');

const COMMAND_COOLDOWN = 600000;

const ignoredCategories = [
    '372086709950611456', // Avatar
    '765832566875095040', // Miscellaneous
    '372085914765099008', // Moderation
    '719883529470738523', // Lake Laogai
    '828540781291241492' // The Garden Gate
]; // Ignore mod categories to avoid conflict with n.topics command

class Topic extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'topic';
        this.aliases = [
        ];

        this.hasSubcmd = true;

        this.info = {
            name: 'topic',
            description: 'Provides a random topic',
            usage: 'topic',
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
            custom: (msg) => {
                let categoryID;
                if (msg.channel instanceof Eris.PublicThreadChannel || msg.channel instanceof Eris.PrivateThreadChannel) {
                    let parentTextChannel = this.bot.getChannel(msg.channel.parentID);
                    categoryID = parentTextChannel.parentID;
                } else {
                    categoryID = msg.channel.parentID;
                }

                return !ignoredCategories.includes(categoryID); 
            },
        });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    init() {
        return [ATLA, Korra]
    }

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

    async execute({ msg, args, executionType }) {
        server.findById(msg.guildID, (err, doc) => {

            // let topics = await axios.get('http://atla.sh/topics.json');
            // topics = topics.data;

            if (executionType !== 2) {
                let timeRemaining = this.handleCooldown(doc.data.topicTimestamps.normal);
                if (timeRemaining !== false) {
                    return this.sendError(msg.channel, `This command has already been used recently!\nTry again in **${timeRemaining}**!`);
                };
            };

            let topic = Math.floor(Math.random() * topics.length);

            if (doc.data.ignoredTopics.length === topics.length) {
                doc.data.ignoredTopics = [];
            };

            while (doc.data.ignoredTopics.includes(topic)) {
                topic = Math.floor(Math.random() * topics.length);
            };

            doc.data.ignoredTopics.push(topic)

            if ((args.length !== 0) && (parseInt(args[0]) <= topics.length)) {
                topic = parseInt(args[0]);
            }
            
            this.sendMessage(msg.channel, {
                embed: {
                    color: this.utils.getColor('blue'),
                    description: topics[topic],
                }
            }).then(doc.data.topicTimestamps.normal = msg.createdAt, doc.save());
            // .then(writeFileSync('src/assets/cooldown.json', JSON.stringify(msg.createdAt)), ignoredTopics.push(topic), writeFileSync('src/assets/IgnoredTopics.json', JSON.stringify(ignoredTopics)));
        })
    }
}


module.exports = Topic;

