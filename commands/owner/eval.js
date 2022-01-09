const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const { inspect } = require('util');
const fetch = require('node-fetch');
const text = require('../../Util/TextFunctions');

class Eval extends Chariot.Command {
    constructor() {
        super();

        this.name = 'eval';
        this.aliases = ['e']
        this.cooldown = 5;
        this.owner = true;
        this.allowDMs = false;
        this.help = {
            message: 'Evaluate the stuff and things!',
            usage: 'eval <text>',
            example: ['eval 1+1'],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
try {

    const code = args.join(' ');
    let evaled = eval(code);
    let raw = evaled;
    let promise, output, bin, download, type, color;

    if (evaled instanceof Promise){
      promise = await evaled
      .then(res => { return { resolved: true, body: inspect(res, { depth: 0 })};})
      .catch(err => { return { rejected: true, body: inspect(err, { depth: 0 })};});
    };

    if (typeof evaled !== 'string'){
      evaled = inspect(evaled, { depth: 0 });
    };

    if (promise){
      output = text.clean(promise.body)
    } else {
      output = text.clean(evaled)
    };

    if (promise?.resolved){
      color = 'GREEN'
      type = 'Promise (Resolved)'
    } else if (promise?.rejected){
      color = 'RED'
      type = 'Promise (Rejected)'
    } else {
      color = 'AQUA'
      type = (typeof raw).charAt(0).toUpperCase() + (typeof raw).slice(1)
    };

    const elapsed = Math.abs(Date.now() - message.createdAt);
    const embed = new Chariot.RichEmbed()
    .setColor(color)
    .addField('\\📥 Input',`\`\`\`js\n${text.truncate(text.clean(code),1000)}\`\`\``)
    .setFooter([
      `Type: ${type}`,
      `Evaluated in ${elapsed}ms.`,
      `Eval`].join('\u2000•\u2000')
    );

    

    embed.addField('\\📤 Output', output.length > 1000
    ? `\`\`\`fix\nExceeded 1000 characters\nCharacter Length: ${output.length}\`\`\``
    : `\`\`\`js\n${output}\n\`\`\``)
 
    return message.channel.createEmbed(embed)
     
  } catch (err) {

    const stacktrace = text.joinArrayAndLimit(err.stack.split('\n'),900,'\n');
    const value = [
      '```xl',
      stacktrace.text,
      stacktrace.excess ? `\nand ${stacktrace.excess} lines more!` : '',
      '```'
    ].join('\n');


    return message.channel.createEmbed(
      new Chariot.RichEmbed()
      .setColor('RED')
      .setFooter([
        `${err.name}`,
        `Evaluated in ${Math.abs(Date.now() - message.createdAt)}ms.`,
        `Eval`].join('\u2000•\u2000'))
        .addField('\\📥 Input',`\`\`\`js\n${text.truncate(text.clean(args.join(' ')),1000,'\n...')}\`\`\``)
        .addField('\\📤 Output', value)
    );
  };

// Command End
    }
}

module.exports = new Eval();