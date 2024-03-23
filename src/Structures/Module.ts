import * as djs from 'discord.js';
import Base from './Base';

interface Module {
	[key: string]: any;
	unload?(...args: any[]): void;
}

abstract class Module extends Base {
    public name: string = this.constructor.name;

    public abstract module: string;
    public abstract description: string;
    public abstract enabled: boolean;

    public abstract start(client: djs.Client, ...args: any[]): any;

    public ensureInterface() {
		// required properties
		if (this.module == undefined) {
			throw new Error(`${this.constructor.name} command must define module property.`);
		}
		if (this.enabled == undefined) {
			throw new Error(`${this.constructor.name} command must define enabled property.`);
		}
	}


    public _start(client: djs.Client, ...args: any[]): any {
        if (this.start) {
            this.start(client, ...args);
        }
    }
}

export default Module;