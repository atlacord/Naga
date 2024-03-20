import Module from '../../Structures/Module';
import * as commands from './commands';

export default class Info extends Module {
    public module         : string    = 'Info';
    public description  : string    = 'Info commands';
    public enabled      : boolean   = true;
    public commands     : {}        = commands;

    public start() {};
}