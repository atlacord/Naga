import * as eris from 'eris';
import Naga from '../Naga';
import { NagaConfig } from '../..';

export default class PermissionManager {
    public naga: Naga;
    public config: NagaConfig;

    constructor(naga) {
        this.config = naga.config;
        this.naga = naga;
    }

    isDev(user: eris.User) {
        if (!user || !user.id) return false;
        if (this.naga.config.developers.includes(user.id)) return true;
    }

    isServerOwner(member: eris.Member, guild: eris.Guild) {
        if (!member || !guild) return false;
        if (member.id === guild.ownerID) return true;
    };

    isStaff(member: eris.Member, channel: eris.GuildChannel) {
        if (!member || !channel.guild) return false;

        if (this.isDev(member.user)) return true;
    }
}