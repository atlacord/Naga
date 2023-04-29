import { Module } from '../../core/structures/';
import * as commands from './commands';

/**
 * Info Module
 * @class Info
 * @extends Module
 */
export default class Info extends Module {
	public module     : string  = 'Info';
	public friendlyName: string = 'Info';
	public description: string  = 'Adds info commands to Naga!';
	public core		  : boolean = true;
	public list       : boolean = false;
	public enabled    : boolean = true;
	public hasPartial : boolean = false;
	public commands   : {} = commands;

	public start() {}
}
