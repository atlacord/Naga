const { Command, CommandOptions, CommandPermissions } = require('axoncore');


class Archive extends Command {

    /**
     * @param {import('axoncore').Module} module
     */
    
    constructor(module) {
        super(module);

        this.label = 'archive';
        this.aliases = [
            'savechat',
            'arc'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'archive',
            description: 'Archives a channels messages into a document',
            usage: 'archive',
        };

        /**
         * @param {CommandOptions}
         */

        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: false,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    execute ( { msg, args } ) {
        try {
           const quantity = Math.round(args)

           if(!quantity || quantity < 2) {
               return this.sendError(msg.channel, `Please provide the quantity of messages you want to archive!`)
           }

           let lastMsg = message.channel.lastMessageID; 

           return message.channel.getMessages({ limit: quantity, before: lastMsg })
           .then(async messages => {
               const count = messages.size; 
               const _id = Math.random().toString(36).slice(-7); 
               let upch = '860761776342040586'
               let senduploadchannel = this.getChannel(upch)

               messages = messages.filter(Boolean).map(message => {
                   return [
                    `[${moment(message.createdAt).format('dddd, do MMMM YYYY hh:mm:ss')}]`,
                    `${message.author.tag} : ${message.content}\r\n\r\n`
                   ].join(' ');
               }); 
               messages.push(`Messages Archived on ![](${message.guild.dynamicIconURL('png', 32)}) **${message.guild.name}** - **#${message.channel.name}** --\r\n\r\n`);
               messages = messages.reverse().join('');


               const res = await senduploadchannel.createMessage(`ARCHIVE FILE FILE - Guild: ${message.guild.id} Channel: ${message.channel.id}`,
               { file: Buffer.from(messages), name: `archive-${_id}.txt`}
             ).then(message => [message.attachments[0].url, message.attachments[0].id])
             .catch(() => ['', null]);

             const url = (res[0].match(/\d{17,19}/)||[])[0];
             const id = res[1];

             return this.sendMessage(msg.channel, {
                embed: {
                    title: `Successfully archived **${quantity}** messages from this channel!`, 
                    color: this.utils.color.dblue,
                    description: [
                    `[\`📄 View\`](${url ? `https://txt.discord.website/?txt=${url}/${id}/archive-${_id}`:''})`,
                    `[\`📩 Download\`](${res[0]})`
                  ].join('\u2000\u2000•\u2000\u2000'),
                   
                }
            });

           })






        } catch (err) {
            this.logger.error(err);
			return this.sendError(msg.channel, `Something went wrong.`,
        )}
    }
}

module.exports = Archive;