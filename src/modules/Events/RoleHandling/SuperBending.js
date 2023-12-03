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
    }

    /**
     * @param {import('eris').Message} message
     * @param {import('axoncore').GuildConfig} guildConfig
     */
    async execute(guild, member, oldMember, guildConfig) { // eslint-disable-line
        const basebending = {
            water: '372085492910522370',
            earth: '372085752319967236',
            fire: '372085669142724608',
            air: '372085326165835777',
            non: '372093851600683011'
        };

        const superbending = {
            water: '1180969376770441298',
            earth: '1180969390049607791',
            fire: '1180969386245378058',
            air: '1180969398048129166',
            non: '1180969393841242194'
        }

        function checkRoles(array, values) {
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
        };

        if (member.roles.includes('811411331621191721') && checkRoles(member.roles, [ basebending.water ])) {
            guild.addMember(member.id, superbending.water, 'Added super-waterbending role');
        }

        if (member.roles.includes('811411331621191721') && checkRoles(member.roles, [ basebending.earth ])) {
            guild.addMember(member.id, superbending.earth, 'Added super-earthbending role');
        }

        if (member.roles.includes('811411331621191721') && checkRoles(member.roles, [ basebending.fire ])) {
            guild.addMember(member.id, superbending.fire, 'Added super-firebending role');
        }

        if (member.roles.includes('811411331621191721') && checkRoles(member.roles, [ basebending.air ])) {
            guild.addMember(member.id, superbending.air, 'Added super-airbending role');
        }

        if (member.roles.includes('811411331621191721') && checkRoles(member.roles, [ basebending.non ])) {
            guild.addMember(member.id, superbending.non, 'Added super-nonbending role');
        }

     Promise.resolve();
    }
}

module.exports = SuperBending;
