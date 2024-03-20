import path from 'path';

export default class Logger {
    private errorRegex = /\((.*):(\d+):(\d+)\)$/;

	public fileName(file: any): string {
		return path.parse(file).name;
	}

	public callerLocation(): any {
		const e: any = new Error();
        const regex = /\((.*):(\d+):(\d+)\)$/;
		const match: any = regex.exec(e.stack.split("\n")[2]);
		return match[1];
	}

    public info(message: string, prefix?: string) {
        if (prefix === undefined) {
            const e: any = new Error();
            const match: any = this.errorRegex.exec(e.stack.split("\n")[2]);
            prefix = this.fileName(match[0])
        }
        return console.info(`[${prefix}] ${message}`);
    }

    public debug(message: string, prefix?: string) {
        if (prefix === undefined) {
            const e: any = new Error();
            const match: any = this.errorRegex.exec(e.stack.split("\n")[2]);
            prefix = this.fileName(match[0])
        }
        return console.debug(`[${prefix}] ${message}`);
    }

    public error(message: Error|string, prefix?: string) {
        if (prefix === undefined) {
            const e: any = new Error();
            const match: any = this.errorRegex.exec(e.stack.split("\n")[2]);
            prefix = this.fileName(match[0])
        }
        return console.error(`[${prefix}] ${message}`);
    }

    public log(message: string, prefix?: string) {
        if (prefix === undefined) {
            const e: any = new Error();
            const match: any = this.errorRegex.exec(e.stack.split("\n")[2]);
            prefix = this.fileName(match[0])
        }
        return console.log(`[${prefix}] ${message}`);
    }
}