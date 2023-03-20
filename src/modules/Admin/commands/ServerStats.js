const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { readFileSync, writeFileSync } = require('fs');
const server = require('../../../Models/Server');

// const userRegex = /<@([^}]+)>/g;

class ServerStats extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'serverstats';
        this.aliases = [
            'ss',
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'serverstats',
            description: 'View server stats related to Naga',
            usage: 'serverstats',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    async execute({msg}) {
        let guild = this.bot.guilds.get('370708369951948800');
        server.findById(guild.id, (err, doc) => {
            let embed = {
                author: {
                    name: guild.name,
                    icon_url: guild.iconURL
                },
                fields: [
                    { name: 'Server Owner', value: this.utils.fullName(this.utils.resolveUser(guild, guild.ownerID)), inline: false },
                    { name: 'Members', value: guild.memberCount.toLocaleString(), inline: false },
                    { name: 'Naga Added On', value: `<t:${Math.floor(guild.joinedAt / 1000)}:F>`, inline: false },
                    { name: 'Topics Used', value: `${doc.data.ignoredTopics.length} / ${doc.data.topics.length}`, inline: false },
                    { name: 'WYRs Used', value: `${doc.data.ignoredWyrs.length} / ${doc.data.wyrs.length}`, inline: false },
                ],
                footer: {
                    text: `Server ID: ${guild.id}`
                }
            };
            msg.channel.createMessage({embed})
        })
    }
};

module.exports = ServerStats;