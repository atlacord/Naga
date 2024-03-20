import CommandMetadata from './CommandMetadata';

export default interface CommandInterface {
	group         : string;
	module?       : string;
	aliases       : string[];
	description   : string;
	expectedArgs  : number;
	cooldown      : number;
	usage         : string|string[];
	defaultUsage? : string;
	disableDM?    : boolean;
	execute(data: CommandMetadata): Promise<{}>;
}
