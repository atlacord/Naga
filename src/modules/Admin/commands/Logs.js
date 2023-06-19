const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { exec } = require('child_process');

class Logs extends Command {
  constructor(module) {
    super(module);

    this.label = 'logs';
    this.aliases = ['l'];

    this.info = {
      name: 'logs',
      description: `Shows the contents of Naga's pm2 logs. Lines argument defaults to 15 and logs argument defaults to out.`,
      usage: 'logs [number of lines] [log type (out, err, or error)]',
    };

    this.options = new CommandOptions(this, {
      argsMin: 0,
      cooldown: null,
      hidden: true,
    });
    
    this.permissions = new CommandPermissions(this, {
      staff: { needed: this.axon.staff.owners },
    });
  }

  /**
   * Sends the results of the 'exec' command in embeds, up to a maximum of 3.
   * @param {eris.Message} msg - The message that executed the bot command
   * @param {String} resultString - The result of the 'exec' command
   */
  splitSendResults(msg, resultString) {
    let splitResult = resultString.match(/[\s\S]{1,1900}[\n\r]/g) || [resultString];

    if(splitResult.length > 2) {
      if(splitResult.length > 3) {
        this.sendMessage(msg.channel, `Response too long at ${resultString.length} chars! Latest content of the file will still be shown:`)
      }
      splitResult = splitResult.slice(splitResult.length - 3);
    }

    const embeds = [];
    for(const result of splitResult) {
      embeds.push({
        color: this.utils.getColor('green'),
        description: `\`\`\`js\n${result}\`\`\``
      });
    }

    msg.channel.createMessage({ embeds: embeds });
  }

  async execute({ msg, args }) {
    const lines = args[0] || 15;

    if(lines < 5) {
      return this.sendError(msg.channel, 'At least 5 lines have to be provided')
    }

    if(lines > 200) {
      return this.sendError(msg.channel, 'You can\'t provide more than 200 lines')
    }

    const logType = args[1]?.toLowerCase() || 'out';

    if(!['out', 'err', 'error'].includes(logType)) {
      return this.sendError(msg.channel, 'Invald log type');
    }

    const command = `pm2 logs Naga --raw --nostream --${logType} --lines ${lines}`;

    exec(command, async (err, stdout, stderr) => {
      if(err) {
        return this.sendError(msg.channel, err);
      }

      if(logType === 'out') {
        this.splitSendResults(msg, stdout);
      } else if(logType === 'err' || logType === 'error') {
        this.splitSendResults(msg, stderr);
      }
    });
  }
}

module.exports = Logs;