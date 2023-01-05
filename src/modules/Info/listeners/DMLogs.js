const { Listener } = require('axoncore');

const WEBHOOK_ID = '1042679890752839750';
const WEBHOOK_TOKEN = 'pgqRCim06T_azwFxTfAvE_F8diAzxUGmGf202ZGY3x-AF_eyGe2fhtWOyyHlxyMpM3L0'

const includedCategories = [ 
    // '372085914765099008', // White Lotus
    '828540781291241492', // Garden Gate
    // '1039274712905298062', // Community Team
    '547159463811874842' // Test Server Category
];

const webhooks = {
    // Garden Gate
    '370708369951948802': { // Old People Camp
        id: '1044101006977413203',
        token: '3-BEVmpU7hYLWqFA9Eh-Ayo6_OzZYDU6ZqzoeK_Yvy2fctWWNZ1gjOfmzEL1i9gUjZ6D'
    },

    '838255530279174144': { // Admin Testing
        id: '1042980993059016775',
        token: 'ExGjXKYne8kipvdfTy9crUdz_3wzZMtwtaPYu3EE1c-KFgh60BuCKop1OAmVy1bAxXWF'
    },

    '971227550426746930': { // Admin Screenshots (forum)
        id: '1044101243498401813',
        token: '2w3JzVjhmS2mNNao-7LEPOBACGKDyVpLLqFBggkj88fuRweZFvJ3Rm6Y_83-8fLFiohH'
    },

    '1008298255035138068': { // Dev Hub
        id: '1044120937697652776',
        token: '7XVP-N7m9Ntp49dI_fZxU-MDla0cvW8ltzSqOvWCbzYmy2-S8KiioHwC83isUWE7g46l',
    },

    // White Lotus
    '913918888343916585': { // News
        id: '1044101376495599646',
        token: 'T8Jf6u3ZM141XlhGaCwrNfy4eFY330SxbefLYTMGOT29VByewGPDdNwAJJCaftMKAlUK'
    },

    '761932330028892194': { // Dai Li
        id: '1044121076726239292',
        token: 'EjiIbf8xJCsoPzq_jUQJ0_ku_Nnt8JOKx26Hv8KQR9XibgeXGPwvyCLPryjhe2nEyqUG'
    },

    '831909387307319336': { // White Lotus Office
        id: '1044121212672036944',
        token: 'kO6BEhfbxbwFOfMDDSGRRv-jnPyPGagdpg3EvcUtVn1iodlYD583IO9V1sDb0kYliVhJ'
    },

    '411903716996677639': { // Bot Interface
        id: '1044101500454064199',
        token: 'tlUDadv-JMr7xmkwY1Is3vInZcuCLx2VEOfJWoAGSsxi-TF_NoH8wLN9EKB-RGuLsNtQ'
    },

    '1042995858578350090': { // Ideas
        id: '1044121387113123840',
        token: '70lCRb6kJN317EGNi9l1mD-upBLaVRbodGXMGGE3mUldk0GRKY1adGOzH7ZuNkuW9iBW'
    },

    // Community Team
    '842980080364158976': { // Reddit Mods
        id: '1044121568546127882',
        token: 'E2dIGK-AJf5MuLet3J9S9e6Jh0keIIu-SoSJNnujcFhh9It2L3FiPgQcA-314I0sX3Fz'
    },

    '1032450052112793700': { // Social Media Team
        id: '1044121708086439977',
        token: 'PGCvouW4nW56aHtri8_opbzOK26FsdV8S28n34Gma1--1-p80gnnCT2I7fMqPJbBrOZP'
    },

    '869740603557158973': { // Wiki Writers
        id: '1044121833647128666',
        token: 'rNodci0Nk5LhH73h8MkfFZLUZyy7tUHKRX8PNx9TQoKsqlF7l2zTbA4NzPtrJl0YP6IE'
    },

    '832247862988898334': { // Event Masters
        id: '1044121987146076170',
        token: 'K_lpTKZCMkk-HTKM_dc6WBK5muogX6yaT5lnzh5jdhN-KiyThizeTItlWi7Hg5qzZS_W'
    },

    // General
    '372087095121936385': { // General Tui
        id: '1044098407746261002',
        token: '4wiNMXba17R5CGhILitYb5UGL0T3X4YUV4R3WZeEpv3fLxB3AwoeB3vapfSACNyplStB'
    },

    '1033182943746723910': { // General La
        id: '1044122503703961680',
        token: 'AbT4GkAqoy60W8vkTiO4Cq6NQoCQ5hAxLJ415uWmNCj_LVRlHZqGeVpp_tVVOeCTa1Pt',
    },

    '372087205063163907': { // Media
        id: '1044122672751190107',
        media: 'o20SuPpFUqdQgmMEbeAU8ndyfoqBHPCS-YYzghMvhvJH5EnVwEdKrtVZ6MVatSQ88WRj'
    },

    // Avatar
    '372086844956868618': { // Ba Sing Se
        id: '1044122844059148348',
        token: 'A6qfZKsqoH6tVseMNT-y4CeNHLhiMTaX4HOQX6NsnR3u4-qp7_ecqwmazINOTL2e6CUB'
    },

    '721604232532459540': { // Republic City
        id: '1044122991170170911',
        token: 'cdxSynOQFPu2--CyGEUVhsbq45NqNVS1hox-UY_IMmGDzH33vBd7I8RrGQ8BmokZ1OtZ'
    },

    '372087003669331969': { // Avatar Literature
        id: '1044123122191847445',
        token: '4VcpkhgMx-4bYXikT7K6yanQDRC6vlwUIXE8NMI99IT9azARjU2lUjWtPPABm7ZQOK_N'
    },

    '498253602788343827': { // Weekly Discussion
        id: '1044123258158583828',
        token: 'erBnDivjPKionsDf19g4QUdmXa7c5j5ssu_QZvNyvt139xL4J0NZEqM9JPxV_Dwwq216'
    },

    // Miscellaneous
    '726405096132575322': { // Lifestyle
        id: '1044123428367634432',
        token: 'm8uEy85Wd2qBsDBzisJqAuKQ04jSXoNCjXrn28v9kPhe4iefY5uzIcCVmvJQSq1Mo832'
    },

    '372087240270151680': { // Creative Corner
        id: '1044123622425493615',
        token: 'iNvzmIlS10yq5f-LhGxLEkeTT4hAEwEMgAPRKvORm1l5-tnclr675vWeySUyoqUhEUOh'
    },

    '884990489756045332': { // Creative Discussion
        id: '1044123730911178832',
        token: 'f5HnFnIErzdUclO1-EfqYb4rjC8RQxwZrZfiK2ptCjHRyKOBVhLE4MhI2ioshTuKj4ry'
    },

    '487958065690312724': { // Entertainment
        id: '1044123858850025472',
        token: '2pwoBl11ujePkCnuSu5Ru55H5P-fxO68EarnrpplJbPOnjjI5UORz6h2_rqgYYnetvcU'
    },

    '812409753602883626': { // Self Care
        id: '1044123982284197889',
        token: 'w6bOaepDpVSa4nYcjQl620BTsYzw4-Jq6iDEjRvh6uvNSM_QKrgO-OJqdgznMFApQlgQ'
    },

    '388122648854528001': { // Serious
        id: '1044124135460196384',
        token: 'FYT2meJaO5_CkXJY2KdDwb2bs2RUelKH5r0mGEveiMo09MbcrVxGIlA8P2eXg5u9ueDP'
    },

    '902485012337799189': { // Wholesome
        id: '1044124246609244160',
        token: 'mva4XvA08r-7uM3DIOfZCjyhBxspQy_qe-SiDnmA-gbHE1pzqwL3h5RDxDMAHDO0Q9mp'
    },

    // Sato's Workshop
    '829563592173027369': { // Naga's Cave
        id: '1044124349784924230',
        token: 'YSbZ78YiuRSy5tc9ngb0LHSEhrq3sbW5oJogPKO6ztaQ4MA98CXUo721bA03Hvv3mFcL'
    },

    '1004827258210504754': { // Naga's Playground
        id: '1044124450972500039',
        token: 'b72sTTkHMwrh5nYYJ0iAuFfGQptpkdtGh8DZ19_IxIrn88b9kTSBcffJz5XhexbgZz3E'
    },
    
    '372087473892884502': { // Bot Commands
        id: '1044124548859183104',
        token: 'lsbkvXFxmU7hFE8afVfMvegkSVZSjKCSqHat2Nv8onSNS_by2e0ZsGHor316WwOLfHD8'
    },

    '418988592740958208': { // Trivia Rumble
        id: '1044124651586064384',
        token: 'Yr_GuUHDhHkGVnb-UO5JR1IaAnyHNE-Yo9lI2GrnkXIzFmIx1bkWVCpLwt7j6PgBTcUA'
    },

    // Voice Channels
    '372383669727526912': { // Beach Cave
        id: '1044124797971476520',
        token: 'NUvKVBHdvF7euHzwNi1n7qfrWEbw39taZPw1xX7CctIIKdlLQP1R6jZwPwrad4giXFmE'
    },

    '719924386228076576': { // Black Cliffs
        id: '1044124924324884520',
        token: 'f7nBVz37RPZe8ocp78isCS_2nqbgiBR_MaHKBPxnX8YJYyzL6ajowW7EKmsseY8TXNcm'
    },

    '456158655650201611': { // Movers Club
        id: '1044125047931031612',
        token: '5ZVgFRBXYC2mr-1Liiy-vbopEy0wi_x8z9mh-Go83fj9SHFT4Wnf8ajX8VcYbe1eBWJy'
    },

    '836266701489831967': { // Ember Island Theatre
        id: '1044126978380402690',
        token: 'g1xd0wZmfFP8JKFx1d5fENIGOqmLSI6I_QdfL8xpgrB7p0gRLbCe5podnOHUjAYVy3tX'
    },
}

class DMLogs extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'DMLogs';

        this.enabled = true;

        this.info = {
            description: 'Logs DMs sent to Naga. Experimental feature, might break',
        };
    }

    displayName(message) {
        return (message).member.nick ?? (message).member.username;
    }

    async executeHook(channel, options) {
        console.log(channel.name);
        if (channel.id in webhooks)    {
            let hook = webhooks[channel.id];
            // console.log(hook);
            await this.bot.executeWebhook(hook.id, hook.token, options);
        }
    }

    /**
     * @param {import('eris').Message} msg
     */

     async execute(msg) { // eslint-disable-line
        try {

            let channel = await this.bot.getChannel(msg.channel.id);

            let embed = {
                author: { name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: msg.author.avatarURL },
                color: this.utils.getColor('blue'),
                title: 'New Message',
                fields: [
                    { name: 'Content', value: null, inline: false },
                    { name: 'Author', value: `${this.utils.fullName(msg.author)}\n(${msg.author.id})`, inline: false },
                    { name: 'Channel', value: `${channel.name}\n(${channel.id})`, inline: false },
                    { name: 'Jump Link', value: `[Click Here](${msg.jumpLink})`, inline: true },
                ],
                footer: { text: `Message ID: ${msg.id}` },
                timestamp: new Date()
            }

            let category;
            let isThread = false;
            console.log(channel.name);
            if (msg.channel.type === 0) { category = msg.channel.parentID } else
            if (msg.channel.type === 11 || 12) {
                console.log(isThread);
                isThread = true;
                console.log(isThread);
                channel = await this.bot.getChannel(msg.channel.parentID);
            }
                embed.description = `${msg.content}`;
                if (msg.referencedMessage !== (undefined || null)) {
                    embed.fields.push(embed.fields[3]);
                    embed.fields[4].value = `[Click Here](${msg.jumpLink})`;
                    embed.fields.push({ name: 'Reply Link', value: `[Click Here](${msg.referencedMessage.jumpLink})`, inline: true });
                    embed.fields[3] = embed.fields[2];
                    embed.fields[2] = embed.fields[1];
                    embed.fields[1] = { name: 'Reply To', value: `${msg.referencedMessage.content}\n\n**Sent by:** ${this.utils.fullName(msg.referencedMessage.author)} (${msg.referencedMessage.author.id})`, inline: false };
                    embed.fields[0].value = `${msg.content}`
                    embed.description = null;
                } else {
                    embed.fields.shift();
                }
                embed.fields.slice(0);

                //console.log(channel);
                await this.executeHook(channel, {
                    username: this.displayName(msg, msg.member),
                    avatarURL: msg.author.avatarURL,
                    embed: embed,
                    // content: msg.content
                })
            return Promise.resolve(); 
        } catch (err) {
            console.error(err.stack);
        }
    }
}

module.exports = DMLogs;
