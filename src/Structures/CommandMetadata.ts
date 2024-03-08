import * as djs from 'discord.js';
import * as naga from '../Core/Naga';

export default interface CommandMetadata {
	message: djs.Message;
	args?: any[];
	t?: Function;
	command?: string;
	// guildConfig?: naga.GuildConfig;
	isDev?: boolean;
	isAdmin?: boolean;
	suppressOutput?: boolean;
	responseChannel?: djs.TextChannel;
}
