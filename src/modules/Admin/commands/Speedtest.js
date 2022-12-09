const { Command, CommandPermissions, CommandOptions } = require('axoncore');
const { exec } = require(`child_process`);

class Speedtest extends Command {
    constructor(module) {
        super(module);

        this.label = 'speedtest';
        this.aliases = ['st'];

        this.info = {
            name: 'speedtest',
            description: 'Execute speedtest (needs Ookla\'s speedtest cli on the vps to work)',
            usage: 'speedtest',
        };

      /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
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
        return this.sendMessage(msg.channel, '```Running speedtest...```').then(m => {
            exec('speedtest', (err, stdout) => {
				if (err) return m.edit('An error occurred.');
				return m.edit('```\n' + stdout + '\n```');
			});
		}).catch(err => {
			return this.sendError(msg.channel, 'Unable to get speedtest.');

        })
	}
}

module.exports = Speedtest;
