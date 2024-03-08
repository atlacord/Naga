import * as djs from 'discord.js';
import * as naga from '../Core/Naga';
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

    public _start(client: djs.Client, ...args: any[]): any {
        if (this.start) {
            this.start(client, ...args);
        }
    }
}

export default Module;