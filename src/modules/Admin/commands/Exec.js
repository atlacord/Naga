const nodeUtil = require('util');

const {
    Command,
    CommandPermissions,
    CommandOptions,
} = require('axoncore');
const { exec } = require(`child_process`);

class Exec extends Command {
    constructor(module) {
        super(module);

        this.label = 'exec';
        this.aliases = ['exe'];

        this.info = {
            name: 'exec',
            description: 'Execute shell commands',
            usage: 'exec [command]',
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
    exec(command) {
		return new Promise((resolve, reject) => {
			exec(command, (err, stdout, stderr) => {
				if (err) return reject(err);
				return resolve(stdout || stderr);
			});
		});
    }
    
    sendCode(channel, message = ' ', lang = '', options = {}) {
        let msg = `\`\`\`${lang}\n${message}\`\`\``;
        if (options.header) {
            msg = `${options.header}\n${msg}`;
        }
        if (options.footer) {
            msg = `${msg}\n${options.footer}`;
        }
        return this.sendMessage(channel, msg, options);
    }

	async execute({ msg, args }) {
		let msgArray = [],
			result;

		try {
			result = await this.exec(args.join(' '));
		} catch (err) {
			result = err;
		}

		msgArray = msgArray.concat(this.utils.splitMessage(result, 1990));

		for (let m of msgArray) {
			this.sendCode(msg.channel, m, 'js');
		}

		return Promise.resolve();
	}
}

module.exports = Exec;
