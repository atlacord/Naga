const { Listener } = require('axoncore');

class EnforceBending extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildMemberUpdate';
        /** Event name (Function name) */
        this.label = 'EnforceBending';

        this.enabled = true;

        this.info = {
            description: 'Enforce sub-bending roles',
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
            fire: '1172722062876495963',
            air: '372085326165835777',
            non: '372093851600683011'
        };
        
        const water = {
            bloodbender: '372198311517618176',
            foggyswamp: '835948368177528842',
            healer: '372162970282622976',
            spiritbender: '488393283031269407',
            fifthnation: '1229466991237267560'
        };

        const earth = {
            glassbender: '833717251433037824',
            lavabender: '372358222725775381',
            metalbender: '372116528692199434',
            sandbender: '473941824684163101',
            seismicsense: '721283880983855225'
        };
        
        const fire = {
            chireader: '721286894075510784',
            combustion: '372358681448284160',
            lightning: '372155442131894282',
            sunwarrior: '822980412699181066',
        };
        
        const air = {
            breathbender: '740838540337741894',
            projection: '372183490508357632',
            weightless: '372182341109547018',
            soundbender: '1253356107574018123'
        }
        
        const non = {
            chiblocker: '372423189264990209',
            kyoshiwarrior: '488393191981187102',
            swordmaster: '488393019444166658',
            yuyanarcher: '894475920780460045'
        };

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

        // let rolediff = member.roles.filter(x => !oldMember.roles.includes(x));

        // if (oldMember.roles.includes(basebending.water) && member.roles.some(r => (
        //     Object.values(earth).includes(r) || Object.values(air).includes(r) || Object.values(fire).includes(r) || Object.values(non).includes(r)
        // ))) {
        //     if (rolediff[0] !== undefined) {
        //         guild.removeMemberRole(member.id, rolediff[0], 'Enforcing bending');
        //     }
        // }
        // if (oldMember.roles.includes(basebending.earth) && member.roles.some(r => (
        //     Object.values(water).includes(r) || Object.values(air).includes(r)|| Object.values(fire).includes(r) || Object.values(non).includes(r)
        // ))) {
        //     if (rolediff[0] !== undefined) {
        //         guild.removeMemberRole(member.id, rolediff[0], 'Enforcing bending');
        //     }
        // }
        // if (oldMember.roles.includes(basebending.air) && member.roles.some(r => (
        //     Object.values(water).includes(r) || Object.values(earth).includes(r) || Object.values(fire).includes(r) || Object.values(non).includes(r)
        // ))) {
        //     if (rolediff[0] !== undefined) {
        //         guild.removeMemberRole(member.id, rolediff[0], 'Enforcing bending');
        //     }
        // }
        // if (oldMember.roles.includes(basebending.fire) && member.roles.some(r => (
        //     Object.values(water).includes(r) || Object.values(earth).includes(r) || Object.values(air).includes(r) || Object.values(non).includes(r) 
        // ))) {
        //     if (rolediff[0] !== undefined) {
        //         guild.removeMemberRole(member.id, rolediff[0], 'Enforcing bending');
        //     }
        // }
        // if (oldMember.roles.includes(basebending.non) && member.roles.some(r => (
        //     Object.values(water).includes(r) || Object.values(earth).includes(r) || Object.values(air).includes(r) || Object.values(fire).includes(r)
        // ))) {
        //     if (rolediff[0] !== undefined) {
        //         guild.removeMemberRole(member.id, rolediff[0], 'Enforcing bending');
        //     }
        // }

        if (oldMember.roles.includes(basebending.water) && checkRoles(member.roles, [ basebending.earth, basebending.fire, basebending.air, basebending.non ])) {
            for (let i in Object.values(water)) {
                guild.removeMemberRole(member.id, Object.values(water)[i], 'Updated bending');
            }
        }

        if (oldMember.roles.includes(basebending.earth) && checkRoles(member.roles, [ basebending.water, basebending.fire, basebending.air, basebending.non ])) {
            for (let i in Object.values(earth)) {
                guild.removeMemberRole(member.id, Object.values(earth)[i], 'Updated bending');
            }
        }

        if (oldMember.roles.includes(basebending.fire) && checkRoles(member.roles, [ basebending.water, basebending.earth, basebending.air, basebending.non ])) {
            for (let i in Object.values(fire)) {
                guild.removeMemberRole(member.id, Object.values(fire)[i], 'Updated bending');
            }
        }

        if (oldMember.roles.includes(basebending.air) && checkRoles(member.roles, [ basebending.water, basebending.earth, basebending.fire, basebending.non ])) {
            for (let i in Object.values(air)) {
                guild.removeMemberRole(member.id, Object.values(air)[i], 'Updated bending');
            }
        }

        if (oldMember.roles.includes(basebending.non) && checkRoles(member.roles, [ basebending.water, basebending.earth, basebending.fire, basebending.air ])) {
            for (let i in Object.values(non)) {
                guild.removeMemberRole(member.id, Object.values(non)[i], 'Updated bending');
            }
        }
     Promise.resolve();
    }
}

module.exports = EnforceBending;
