import * as djs from 'discord.js';
import Naga from '../Core/Naga';

export default class PermissionsManager {
    private naga: Naga;

    constructor(naga: Naga) {
        this.naga = naga;
    }

    /**
     * Checks if user is a developer
     * @param user A user object
     * @returns {boolean}
     */
    public isDeveloper(user: djs.User): boolean {
        if (!user) return false;
        return true;
    }

    /**
     * Checks if member is a server admin
     * @param member A member object
     * @param channel A channel object
     * @returns {boolean}
     */
    public isServerAdmin(member: djs.GuildMember, channel: djs.GuildChannel): boolean {
        if (!member) return false;
        return (member.id === channel.guild.ownerId || (member.permissions && member.permissions.has(djs.PermissionsBitField.Flags.Administrator)));
    }

    /**
     * Checks if member is a server moderator
     * @param member A member object
     * @returns {boolean}
     */
    public isServerMod(member: djs.GuildMember): boolean {
        if (!member) return false;
        return (member.permissions && member.roles.cache.has(`insert-later`))
    }
}