const { Listener } = require('axoncore');

class SuperBending extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildMemberUpdate';
        /** Event name (Function name) */
        this.label = 'SuperBending';

        this.enabled = true;

        this.info = {
            description: 'Assigns superbending roles to members who meet the level requirement.',
        };

        this.basebending = {
            water: '372085492910522370',
            earth: '372085752319967236',
            fire: '1172722062876495963',
            air: '372085326165835777',
            non: '372093851600683011'
        };

        this.superbending = {
            water: '1180969376770441298',
            earth: '1180969390049607791',
            fire: '1180969386245378058',
            air: '1180969398048129166',
            non: '1180969393841242194'
        };

        this.rankRoles = [
            '811411225639518209', // Elder
            '811411331621191721', // Luminary
            '811411413573697556' // Enlightened
        ]
    }

    hasRankRole(memberRoles) {
        for (let role of this.rankRoles) {
            if (memberRoles.includes(role)) return true;
        }
        return false;
    }

    /**
     * @param {import('eris').Message} message
     * @param {import('axoncore').GuildConfig} guildConfig
     */
    async execute(guild, member, oldMember, guildConfig) { // eslint-disable-line
        if (!this.hasRankRole(member.roles)) return;

        (() => {
            const basebendingRoles = member.roles.filter(r => Object.values(this.basebending).includes(r));
            if (basebendingRoles.length > 1) {
                const rolesToRemove = basebendingRoles.filter(r => oldMember.roles.includes(r));
                rolesToRemove.forEach(r => guild.removeMemberRole(member.id, r, 'Removed extra base-bending role'));
            }
        })();

        const checkRoles = (array, values) => {
            let res;
            for (let i in values) {
                if (array.includes(values[i]) === true) {
                    res = true;
                    break;
                } else {
                    res = false;
                }
            }
            return res;
        }

        const removeOldSuperbendingRoles = (newRole) => {
            for (let role of Object.values(this.superbending)) {
                if (role !== newRole) {
                    guild.removeMemberRole(member.id, role, 'Removed old super-bending role');
                }
            }
        }

        const rankRoles = [
            '811411225639518209', // Elder
            '811411331621191721', // Luminary
            '811411413573697556' // Enlightened
        ]

        if (checkRoles(member.roles, [ this.basebending.water ])) {
            guild.addMemberRole(member.id, this.superbending.water, 'Added super-waterbending role');
            return removeOldSuperbendingRoles(this.superbending.water);
        }

        if (checkRoles(member.roles, [ this.basebending.earth ])) {
            guild.addMemberRole(member.id, this.superbending.earth, 'Added super-earthbending role');
            return removeOldSuperbendingRoles(this.superbending.earth);
        }

        if (checkRoles(member.roles, [ this.basebending.fire ])) {
            guild.addMemberRole(member.id, this.superbending.fire, 'Added super-firebending role');
            return removeOldSuperbendingRoles(this.superbending.fire);
        }

        if (checkRoles(member.roles, [ this.basebending.air ])) {
            guild.addMemberRole(member.id, this.superbending.air, 'Added super-airbending role');
            return removeOldSuperbendingRoles(this.superbending.air);
        }

        if (checkRoles(member.roles, [ this.basebending.non ])) {
            guild.addMemberRole(member.id, this.superbending.non, 'Added super-nonbending role');
            return removeOldSuperbendingRoles(this.superbending.non);
        }

     Promise.resolve();
    }
}

module.exports = SuperBending;
