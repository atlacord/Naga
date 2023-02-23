const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const config = require('../../../../configs/config.json');
const server = require('../../../Models/Server');

// const userRegex = /<@([^}]+)>/g;

class ChannelInfo extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'channelinfo';
        this.aliases = ['channel', 'ci'];

        this.hasSubcmd = false;

        this.info = {
            name: 'channelinfo',
            description: 'Displays information about a channel',
            usage: 'channelinfo [channel]',
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

    async execute({ msg, args }) {
        let channel = await this.bot.getChannel(args[0]);

        let category = await this.bot.getChannel(channel.parentID);

        let channelTypes = {
            0: 'Text Channel',
            1: 'DM Channel',
            2: 'Voice Channel',
            3: 'Group DM Channel',
            4: 'Category',
            5: 'News Channel',
            6: 'Store Channel',
            10: 'News Thread',
            11: 'Public Thread',
            12: 'Private Thread',
            13: 'Stage Channel',
            15: 'Forum Channel'
        };

        let embed = {
            author: {
                name: channel.guild.name,
                icon_url: channel.guild.iconURL,
            },
            color: this.utils.getColor('blue'),
            fields: [
                { name: 'Name', value: channel.name, inline: false },
                { name: 'Type', value: channelTypes[channel.type], inline: false },
                { name: 'Category', value: category.name, inline: false },
                { name: 'Last Active', value: `<t:${Math.floor(this.utils.convertSnowflakeToDate(channel.lastMessageID) / 1000)}:f>`, inline: false }
            ],
            footer: {
                text: `ID: ${channel.id} | Created at`,
            },
            timestamp: new Date(channel.createdAt)
        }

        if ((channel.type === 11) || (channel.type === 12)) {
            embed.fields[2].name = 'Parent Channel';
        }
        
        msg.channel.createMessage({embed});
    }
}

module.exports = ChannelInfo;