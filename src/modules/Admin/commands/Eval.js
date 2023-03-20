/* eslint-disable no-unused-vars */
const nodeUtil = require('util');

const {
    Command,
    CommandPermissions,
    CommandOptions,
    CommandResponse,
} = require('axoncore');

class Eval extends Command {
    constructor(module) {
        super(module);

        this.label = 'eval';
        this.aliases = ['eval', 'e'];

        this.info = {
            name: 'eval',
            description: 'Eval',
            usage: 'eval [js code]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: null,
            hidden: true,
        } );
        
        /**
         * @type {CommandPermissions}
         */
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    shardcalc() {
        const shard = Math.floor((args[0]/ 4194304) % 2304)
        return shard;
    }

    premcalc() {
        const shard = Math.floor((args[0]/ 4194304) % 32)
        return shard;
    }

    async execute(env) {
        const { msg, args } = env;
        var dynoApi = 'https://dyno.gg/api/status?includeApi=true&shard_status=1';
        var deeno = 'https://dyno.gg/api/status?includeApi=true&shard_status=1'
        let evalString;
        try {
            // eslint-disable-next-line no-eval
            evalString = await eval(args.join(' ') );

            if (typeof evalString === 'object') {
                evalString = nodeUtil.inspect(evalString, { depth: 0, showHidden: true } );
            } else {
                evalString = String(evalString);
            }

            evalString = this.cleanUpToken(evalString);

            if (evalString.length === 0) {
                return this.sendError(msg.channel, 'Please provide something to eval.');
            }

            const splitEvaled = evalString.match(/[\s\S]{1,1900}[\n\r]/g) || [evalString];
            
            if (splitEvaled.length > 3) {
                this.sendMessage(msg.channel, `Cut the response! [3/${splitEvaled.length} | ${evalString.length} chars]`);
            }
            
            for (let i = 0; i < 3; i++) {
                if (!splitEvaled[i] ) {
                    break;
                }
                this.sendCode(msg.channel, splitEvaled[i] );
            }
        } catch (err) {
            this.utils.logError(msg, err, 'Internal', `Error: ${err}`);
        }
        
        return new CommandResponse( {
            success: true,
        } );
    }

    /**
     * @param {String} evalString
     */
    cleanUpToken(evalString) {
        return evalString.replace(new RegExp(this.bot._token, 'g'), 'ur mom');
    }

    /**
     * @param {import('eris').TextableChannel} channel
     * @param {String} content
     * @param {String} lang
     */
    sendCode(channel, content, lang = 'js') {
        return this.sendMessage(channel, {
            embed: {
                color: this.utils.getColor('green'),
                author: {
                    name: 'Eval Result',
                    // icon_url: msg.author.avatarURL
                },
                description: `\`\`\`${lang}\n${content}\`\`\``
            }
        });
    }
}

module.exports = Eval;