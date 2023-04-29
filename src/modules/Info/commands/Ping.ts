'use strict';

import { Command, CommandData } from '../../../core/structures/index';

export default class Ping extends Command {
    public aliases      : string[] = ['ping'];
	public description  : string   = 'Ping the bot';
    public usage        : string   = 'ping';
    public example      : string   = 'ping';
	public hideFromHelp : boolean  = true;
	public noDisable    : boolean  = true;
	public cooldown     : number   = 3000;
	public expectedArgs : number   = 0;

	public execute({ message, t }: CommandData) {
		let start = Date.now();

		return this.sendMessage(message.channel, 'Pong!')
			.then(msg => {
				let diff = (Date.now() - start);
				return msg.edit(`Pong! \`${diff}ms\``);
			});
	}
}
