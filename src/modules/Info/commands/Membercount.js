const { Command, CommandOptions } = require('axoncore');

class Membercount extends Command {

    /**
     * @param {import('axoncore').Module} module
     */
    
    constructor(module) {
        super(module);

        this.label = 'membercount';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'membercount',
            description: 'View how many members are in your server',
            usage: 'membercount',
        };

        /**
         * @param {CommandOptions}
         */

        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: true,
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    execute ({ msg, args }) {

        try {
        const guild = this.bot.guilds.get(args[0]) || msg.channel.guild;
        let allMembers = guild.members.size;
        let humanMembers = guild.members.filter(member => !member.user.bot).length;
        let botMembers = guild.members.filter(member => member.user.bot).length;

        let roles = msg.member.roles.map(r => msg.channel.guild.roles.get(r)).filter(r => r.color);
            roles.sort((a,b) => b.position - a.position);
            let roleColor = 16777215
            
            if(msg.member.roles.length > 0) 
            roleColor = roles[0].color
        
        this.sendMessage(msg.channel, {
            embed: {
                color: roleColor,

                author: { 
                    name: guild.name, 
                    icon_url: guild.iconURL 
                },

                fields: [
                { name: 'Members', value: allMembers.toLocaleString(), inline: true },
                { name: 'Humans', value: humanMembers.toLocaleString(), inline: true },
                { name: 'Bots', value: botMembers.toLocaleString(), inline: true }
                ],
            
                footer: { 
                    text: `ID: ${guild.id}` 
                },
                timestamp: new Date()
            }
        })
    } catch(err) {
        this.utils.logError(msg, err, 'internal', `An error occurred.`);
    }
}
}

module.exports = Membercount;