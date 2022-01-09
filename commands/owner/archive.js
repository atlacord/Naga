const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const cchannel = require('../../Util/channelconfig.json')
const {
    msgCollection 
} = require('../../Util/BotFunctions')
const moment = require('moment');



class Archive extends Chariot.Command {
    constructor() {
        super();

        this.name = 'archive';
        this.cooldown = 5;
        this.owner = true;
        this.allowDMs = false;
        this.help = {
            message: 'Archives all messages in a channel',
            usage: 'archive',
            example: ['archive'],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
const quantity = Math.round(args)


if(!quantity || quantity < 2) {
    return  message.channel.createEmbed(
                        new Chariot.RichEmbed()
                            .setColor(colour.failedColour)
                            .setTitle("<:no:917982868922335272> Please provide the quantity of messages to be deleted (Greater than 2)")
                    )
}


let lastMsg = message.channel.lastMessageID; 

return message.channel.getMessages({ limit: quantity, before: lastMsg })
.then(async messages => {

// Pasted
    const count = messages.size;
    const _id = Math.random().toString(36).slice(-7);
    let upch = cchannel.uploadChannel
    let senduploadchannel = chariot.getChannel(upch)

 
    messages = messages.filter(Boolean).map(message => {
        return [
          `[${moment(message.createdAt).format('dddd, do MMMM YYYY hh:mm:ss')}]`,
          `${message.author.tag} : ${message.content}\r\n\r\n`
        ].join(' ');
      });
    messages.push(`Messages Archived on ![](${message.guild.dynamicIconURL('png', 32)}) **${message.guild.name}** - **#${message.channel.name}** --\r\n\r\n`);
    messages = messages.reverse().join('');



console.log(messages)

const res = await senduploadchannel.createMessage(
    `ARCHIVE FILE FILE - Guild: ${message.guild.id} Channel: ${message.channel.id}`,
    { file: Buffer.from(messages), name: `archive-${_id}.txt`}
  ).then(message => [message.attachments[0].url, message.attachments[0].id])
  .catch(() => ['', null]);
  

      const url = (res[0].match(/\d{17,19}/)||[])[0];
      const id = res[1];
     
     //const url = lastlog.attachments().first().url
     // const id = res.id

    return message.channel.createEmbed(
              new Chariot.RichEmbed()
              .setTitle(`Successfully arhived **${quantity}** messages from this channel!`)
              .setColor(colour.coreColour)
              .setDescription([
                `[\`📄 View\`](${url ? `https://txt.discord.website/?txt=${url}/${id}/archive-${_id}`:''})`,
                `[\`📩 Download\`](${res[0]})`
              ].join('\u2000\u2000•\u2000\u2000'))
          )

        
})

/* // pasted here from Naga
return message.channel.bulkDelete(quantity, true)
.then(async messages => {

  const count = messages.size;
  const _id = Math.random().toString(36).slice(-7);
  const uploadch = client.channels.cache.get(client.config.channels.uploads);

  messages = messages.filter(Boolean).map(message => {
    return [
      `[${moment(message.createdAt).format('dddd, do MMMM YYYY hh:mm:ss')}]`,
      `${message.author.tag} : ${message.content}\r\n\r\n`
    ].join(' ');
  });

  messages.push(`Messages Cleared on ![](${message.guild.iconURL({size: 32})}) **${message.guild.name}** - **#${message.channel.name}** --\r\n\r\n`);
  messages = messages.reverse().join('');

  const res = uploadch ? await uploadch.send(
    `BULKDELETE FILE - ${message.guild.id} ${message.channel.id}`,
    { files: [{ attachment: Buffer.from(messages), name: `bulkdlt-${_id}.txt`}]}
  ).then(message => [message.attachments.first().url, message.attachments.first().id])
  .catch(() => ['', null]) : ['', null];

  const url = (res[0].match(/\d{17,19}/)||[])[0];
  const id = res[1];

  return message.channel.send(
    `Successfully deleted **${count}** messages from this channel!`,
    new MessageEmbed()
    .setColor('AQUA')
    .setDescription([
      `[\`📄 View\`](${url ? `https://txt.discord.website/?txt=${url}/${id}/bulkdlt-${_id}`:''})`,
      `[\`📩 Download\`](${res[0]})`
    ].join('\u2000\u2000•\u2000\u2000'))
  );
});

*/






/* This is the one version I found of it, going to use Naga's old one first to try and see
let writeMsg = []
let lastMsg = message.channel.lastMessageID;

msgCollection(message, lastMsg, writeMsg)
*/
//

    }
}

module.exports = new Archive();