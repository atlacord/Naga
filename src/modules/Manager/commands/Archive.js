const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const moment = require('moment');
const { ImgurClient } = require('imgur');

// Probably should've put these in an env variable file but whatever
const clientId = '52b527e0d60b7b0';
const clientSecret = 'b433ad10a9334a0ac51f4953f3b8e46a53ff4880';
const refreshToken = '41839a7d6ff2db6ef2caf6f4ae4005ce29302eac';


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
            guildOnly: true,
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

    async uploadImage(client, count, msg) {
        let imglink = await client.upload({
            image: msg.attachments[count].url,
            title: 'Naga archive upload',
            description: `Channel ID: ${msg.channel.id}, Message ID: ${msg.id}`
        })
        return imglink.data.link;
    }

    async execute ( { msg, args } ) {

        const client = new ImgurClient({
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
          });

        try {
            let channel = args[0].replace('<#','');
            channel = channel.replace('>', '').toString();
            const quantity = Math.round(args[1]);

           if(!quantity || quantity < 2) {
               return this.sendError(msg.channel, `Please provide the quantity of messages you want to archive!`)
           }

           let lastMsg = msg.channel.lastMessageID; 

           return await this.bot.getMessages(channel, { limit: quantity, before: lastMsg })
           .then(async messages => {
               const count = messages.size; 
               const _id = Math.random().toString(36).slice(-7); 
               let upch = '570053930193518594'
               let senduploadchannel = await this.bot.getChannel(upch)

               messages = messages.filter(Boolean).map(msg => {
                let imgurLink = null
                if (msg.attachments.length >= 1) {
                    for (let i = 0; i <= msg.attachments.length; i += 1) {
                        imgurLink = this.uploadImage(client, i, msg);
                        console.log(imgurLink);
                    }
                }
                   return [
                    `[${moment(msg.createdAt).format('dddd, do MMMM YYYY hh:mm:ss')}]`,
                    `${msg.author.username}#${msg.author.discriminator} (${msg.author.id}):\nContent: ${msg.content}\nAttachments: ${imgurLink || null}\r\n\r\n`
                   ].join(' ');
               }); 
               messages.push(`Messages Archived on ![](${msg.channel.guild.dynamicIconURL('png', 32)}) **${msg.channel.guild.name}** - **<#${channel}>** --\r\n\r\n`);
               messages = messages.reverse().join('');


               const res = await senduploadchannel.createMessage(`ARCHIVE FILE FILE - Guild: ${msg.channel.guild.id} Channel: ${channel.id}`,
               { file: Buffer.from(messages), name: `archive-${_id}.txt`}
             ).then(msg => [msg.attachments[0].url, msg.attachments[0].id])
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
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}

module.exports = Archive; 
