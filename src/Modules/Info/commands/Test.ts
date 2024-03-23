import { Message } from 'discord.js';

import Command from '../../../Structures/Command';
import CommandMetadata from '../../../Structures/CommandMetadata';

export class Test extends Command {

    public aliases      : string[]  = ['test'];
    public description  : string    = 'Displays the ping between Naga and the Discord API';
    public usage        : string    = 'test';
    public example      : string    = 'test';
    public cooldown     : number    = 5000;
    public expectedArgs : number    = 0;

    public execute({ message, t}: CommandMetadata) {
        let start = Date.now();

        return this.sendMessage(message.channel, 'Pong!').then((msg: Message) => {
            let diff = (Date.now() - start);
            return msg.edit(`Pong! \`${diff}ms\``);
        })
    }
}