const { Command, CommandOptions } = require('axoncore');

const DISCORD_EPOCH = 1420070400000;

class Snowflake extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'snowflake';
        this.aliases = [
            'idtimestamp',
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'snowflake',
            description: 'Returns the timestamp a Discord snowflake was created (eg. user IDs, channel IDs, etc).',
            usage: 'snowflake 370708369951948800',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
        const milliseconds = BigInt(snowflake) >> 22n
        return new Date(Number(milliseconds) + epoch)
    }

    validateSnowflake(snowflake, epoch) {
        if (!Number.isInteger(+snowflake)) {
            this.sendError(msg.channel, 'That doesn\'t look like a snowflake. Snowflakes contain only numbers.')
        }
    
        if (snowflake < 4194304) {
            this.sendError(msg.channel, 'That doesn\'t look like a snowflake. Snowflakes are much larger numbers.')
        }
    
        const timestamp = this.convertSnowflakeToDate(snowflake, epoch)
    
        if (Number.isNaN(timestamp.getTime())) {
            this.sendError(msg.channel, 'That doesn\'t look like a snowflake. Snowflakes have fewer digits.')
        }
    
        return timestamp;
    }

    async execute( { msg, args } ) {
        try {
            let timestamp = this.validateSnowflake(args[0], DISCORD_EPOCH);
            let embed = {
                title: 'Valid snowflake!',
                color: this.utils.color.blue,
                description: `This snowflake was created at **<t:${Math.floor(timestamp / 1000)}>**`,
            //  timestamp: new Date()
            }
            this.sendMessage(msg.channel, {embed});
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}

module.exports = Snowflake;