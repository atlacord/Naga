import * as eris from 'eris';

export default interface CommandData {
	message: eris.Message;
	args?: any[];
	t?: Function;
	command?: string;
	guildConfig?: any;
	isAdmin?: boolean;
	isDev?: boolean;
	suppressOutput?: boolean;
	responseChannel?: eris.TextChannel;
}
