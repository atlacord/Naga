import Module from '../../Structures/Module';
import * as commands from './commands';

export default class Misc extends Module {
    public module         : string    = 'Misc';
    public description  : string    = 'Miscellaneous commands';
    public enabled      : boolean   = true;
    public commands     : {}        = commands;

    public start() {};
}