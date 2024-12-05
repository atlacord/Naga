const { Listener } = require('axoncore');

class WelcomeMessage extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'interactionCreate';
        /** Event name (Function name) */
        this.label = 'interactionCreate-WelcomeMessage';

        this.enabled = true;

        this.info = {
            description: 'Powers welcome messages',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(interaction) { // eslint-disable-line
        if (interaction.data.component_type === 2 && interaction.data.custom_id === "RoleInfoButton") {
            return interaction.createMessage({
                flags: 64,
                embeds: [
                    /* {
                        color: this.utils.getColor('lotus'),
                        image: {
                             url: `https://media.discordapp.net/attachments/831909387307319336/1051326858580467792/serverroles.png`
                        } 
                    },
                    */
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Activity-based Ranks
                        \nAs you gain XP in the server (see the FAQ section in this channel for more information about XP), you will automatically receive special rank roles:
                        
                        \n\n__1,150 XP__   • <@&720343753805660183> – Grants permissions to send images and embedded links.
                        \n__4,675 XP__     • <@&372178560254869504> - Grants access to Discord polls.
                        \n__11,825 XP__    • <@&372163599130558466> – Grants access to one sub-bending role of your choice, as well as permission to request the <@&830138455337730049> role (see "Requestable Roles" below).
                        \n__42,000 XP__    • <@&372179082634330112> 
                        \n__101,675 XP__   • <@&372179236842242048>
                        \n__200,850 XP__   • <@&423269295930343424> 
                        \n__349,525 XP__   • <@&434950614997401600> - Allows custom bot commands, made in <#1093583806813970444>.
                        \n__557,700 XP__   • <@&811411225639518209> - Grants high level roles (<@&1180969376770441298>, <@&1180969390049607791>, <@&1180969386245378058>, <@&1180969398048129166> and <@&1180969393841242194>) based on the bending of your choice.
                        \n__835,375 XP__   • <@&811411331621191721> 
                        \n__1,192,550 XP__ • <@&811411413573697556>`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Requestable Roles
                        \nThe following roles cannot be self-assigned, but eligible users *who are in good standing with the staff team* may request them by DMing <@718577208687460482> Mod Mail:
                            
                        \n\n <@&830138455337730049>  – Given to members who want to host events here. Grants access to <#1281662631698108486>, our channel where Event Masters organize and coordinate activities for the server. You must have the <@&372163599130558466> role (11,825 XP) to be eligible for the role; our staff team also reserves the right to remove this role from a user if they go a prolonged period without hosting any events.`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Honorary Roles, Prize Roles, and Other Non-Assignable Roles
                        \n The following roles are not regularly available and can only be obtained under special circumstances:
                               
                        \n\n<@&787644908705153024> – A special birthday role given automatically by <@772934946200485938> to users on their birthday (UTC time). You must have your birthday added to your Naga profile for this to work; you can set this up by using the ` + '`n.setbirthday`' +  ` command in <#372087473892884502>.
                               
                        \n\n<@&709818677532557343> – A temporary (1-week) role given to the winner(s) of Avatar games that we hold in the server. To get notifications for when such games are held, grab yourself the <@&709837040895656028> role (see "Choose your notifications!" in <id:customize>).
                               
                        \n\n<@&516790566017564684> – A temporary (1-month) role given to the winner(s) of contest events that we hold in the server. To get notifications for when such events are held, grab yourself the <@&497208797039689749> role (see "Choose your notifications!" in <id:customize>). After 1 month, this role is removed and replaced with <@&530972685610778635> instead.
                               
                        \n\n<@&586128911302131725> – An honorary role given automatically to server boosters. Grants access to <#826851222459514923>, our private chat channel for Team Avatar members.`
                    }
                ]
            })        
        }

        if (interaction.data.component_type === 2 && interaction.data.custom_id === "ChannelInfoButton") {
            interaction.createMessage({
                flags: 64,
                components: [{
                    type: 1, 
                    components: [
                        {
                            type: 2,
                            label: "Page Two", 
                            style: 1, 
                            custom_id: "ChannelInfoButton2"
                        }
                    ]
                }],
                embeds: [
                    /* {
                        color: this.utils.getColor('lotus'),
                        image: {
                            url: `https://cdn.discordapp.com/attachments/411903716996677639/1051303245957570581/channels2.png`
                        } 
                    },
                    */
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Server Guide
                        \n- <#1066580298290176121> - Our server rules. Be sure to read them before participating in the server!
                        \n- <#1053064927935467530> - The channel you're in now! The important information hub of the server. 
                        \n- <#1065945888507310191> - Our channel for assigning level-restricted roles (eg. sub-bending)!
                        \n- <#1305666414610350090> - Our partnered Discord servers which you can also join and enjoy!
                        \n- <#1200650255524438096> - Our hall of fame for past contest winners!`
                    },
                    { 
                        color: this.utils.getColor('lotus'),
                        description:`## Bulletin
                        \n- <#372088315467399170> – For announcing news, updates and special occasions.
                        \n- <#831063798873587743> – For announcing community events such as streams, gaming/book/music nights and much more!
                        \n- <#835240650051944469> – For announcing news related to the Avatar Universe.
                        \n- <#782411596679872542> – Channel for all minor server changes and updates for channels and features.
                        \n- <#1007044599287656559> – For announcing Birthdays of our server members! Info on how to sign up in this channel. 
                        \nBe sure to give yourself appropriate roles in <id:customize> for notifications in all previously listed channels!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Meta
                        \n- <#1093583806813970444> — Post your suggestions here for the staff to review!
                        \n- <#794360973963165716> – Place your emote ideas which you would like to see in the server!
                        \n- <#709827097559826553> – Avatar Games channel that opens periodically when a game is hosted. Users with the Avatar Games role will be notified when it's open.
                        \nAny ongoing contest channels will go into this category as well!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## General Channels
                        \n- <#761932923217379338> – Channel for the arrival of new members and for us to greet them!
                        \n- <#826851222459514923> – A private channel for server boosters.
                        \n- <#372087095121936385> – Our general chat of the server, off-topic conversations and A:TLA&TLOK talk is allowed.
                        \n- <#1033182943746723910> — A forum channel for users to discuss general topics at their own pace. Anything goes!
                        \n- <#372087205063163907> – Post your memes and other videos and images here. No NSFW/NSFL content and any content that breaks the rules.
                        \n- <#719848144719970324> – The best jokes and moments go here.`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Avatar Discussion Channels
                        \n- <#372086844956868618> – The main channel for Avatar: The Last Airbender discussions.
                        \n- <#721604232532459540> – The main channel for Legend of Korra discussions.
                        \n- <#1120464986230239332> — Discuss Netflix's live-action adaptation of Avatar: The Last Airbender here!
                        \n- <#372087003669331969> – Here you can discuss Avatar related comics, novels, and fan fictions! 
                        \n- <#498253602788343827> – Discuss the latest weekly topic, as long as it's within the rules!
                        \n- <#372098279615496192> – Posts content directly from our partnered subreddit and the official ATLA YouTube channel.`
                    }
                ]
            })                                
        }
        if (interaction.data.component_type === 2 && interaction.data.custom_id === "ChannelInfoButton2") {
            interaction.editParent({
                flags: 64,
                components: [{
                    type: 1, 
                    components: [{
                        type: 2,
                        label: "Page One", 
                        style: 1, 
                        custom_id: "ChannelInfoButton1Edit"
                    }],
                }],

                embeds: [
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Miscellaneous
                        \n- <#726405096132575322> – For pictures of your pets, food, or any other amazing things you'd like to share.
                        \n- <#372087240270151680> – For all forms of art! Be sure to credit the artist by posting a link to the source. Discussions of these works should be done in <#884990489756045332>! Infringement and theft of intellectual property is forbidden and subject to punishment by rule 6 in <#1066580298290176121>.
                        \n- <#884990489756045332> – For discussing art or other creative works posted in <#372087240270151680>!
                        \n- <#487958065690312724> – For discussing sports, music, movies, TV shows, games or books! Be sure to use spoiler tags if something recently released is being discussed! Any announcements regarding gaming offers will be posted and pinned in this channel too! 
                        \n- <#902485012337799189> – For wholesome content of all forms such as nice things that happened in life, or wholesome things from around Discord! Also be sure to participate in our Wholesome Wednesdays, and give yourself the appropriate role (see "Choose your notifications!" in <id:customize>) to be pinged for these!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Sato's Workshop
                        \n- <#829563592173027369> – Channel for playing with our <@772934946200485938> multi-purpose bot through various games!
                        \n- <#1004827258210504754> –  Secondary channel for playing with the Naga bot, same as above.
                        \n- <#372087473892884502> – The standard channel for sending bot commands.
                        \n- <#418988592740958208> – The Trivia Rumble channel for playing Trivia games with our custom <@631650441477750808> trivia bot!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Voice Channels
                        \n The text chat for each voice channel is located within that VC itself.
                        \n- <#372087824083845130> – Use this channel to listen to music or just chat!
                        \n- <#370708369951948804>  – Secondary VC for users with <@&720343753805660183> rank and above.
                        \n- <#1056703542745890899> – For hosting our streams! Stay up to date by checking out our Events tab!
                        \n- <#836266973746692116> – For our non-streaming stage events!`
                    }                 
                ]
            })
        }                               

        if (interaction.data.component_type === 2 && interaction.data.custom_id === "ChannelInfoButton1Edit") {
            interaction.editParent({
                flags: 64,
                components: [{
                    type: 1, 
                    components: [{
                        type: 2,
                        label: "Page Two", 
                        style: 1, 
                        custom_id: "ChannelInfoButton2"
                    }]
                }],

                embeds: [
                    /* {
                        color: this.utils.getColor('lotus'),
                        image: {
                            url: `https://cdn.discordapp.com/attachments/411903716996677639/1051303245957570581/channels2.png`
                        } 
                    },
                    */
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Server Guide
                        \n- <#1066580298290176121> - Our server rules. Be sure to read them before participating in the server!
                        \n- <#1053064927935467530> - The channel you're in now! The important information hub of the server. 
                        \n- <#1065945888507310191> - Our channel for assigning level-restricted roles (eg. sub-bending)!
                        \n- <#1305666414610350090> - Our partnered Discord servers which you can also join and enjoy!
                        \n- <#529791576545951744> - Our hall of fame for past contest winners!`
                    },
                    { 
                        color: this.utils.getColor('lotus'),
                        description:`## Bulletin
                        \n- <#372088315467399170> – For announcing news, updates and special occasions.
                        \n- <#831063798873587743> – For announcing community events such as streams, gaming/book/music nights and much more!
                        \n- <#835240650051944469> – For announcing news related to the Avatar Universe.
                        \n- <#782411596679872542> – Channel for all minor server changes and updates for channels and features.
                        \n- <#1007044599287656559> – For announcing Birthdays of our server members! Info on how to sign up in this channel. 
                        \nBe sure to give yourself appropriate roles in <id:customize> for notifications in all previously listed channels!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Meta
                        \n- <#1093583806813970444> — Post your suggestions here for the staff to review!
                        \n- <#794360973963165716> – Place your emote ideas which you would like to see in the server!
                        \n- <#709827097559826553> – Avatar Games channel that opens periodically when a game is hosted. Users with the Avatar Games role will be notified when it's open.
                        \nAny ongoing contest channels will go into this category as well!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## General Channels
                        \n- <#761932923217379338> – Channel for new users to chat in and get acquainted with the community until they feel comfortable to chat in the general chats regularly!
                        \n- <#826851222459514923> – A private channel for server boosters.
                        \n- <#372087095121936385> – Our general chat of the server, off-topic conversations and A:TLA&TLOK talk is allowed.
                        \n- <#1033182943746723910> — A forum channel for users to discuss general topics at their own pace. Anything goes!
                        \n- <#372087205063163907> – Post your memes and other videos and images here. No NSFW/NSFL content and any content that breaks the rules.
                        \n- <#719848144719970324> – The best jokes and moments go here.`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Avatar Discussion Channels
                        \n- <#372086844956868618> – The main channel for Avatar: The Last Airbender discussions.
                        \n- <#721604232532459540> – The main channel for Legend of Korra discussions.
                        \n- <#1120464986230239332> — Discuss Netflix's live-action adaptation of Avatar: The Last Airbender here!
                        \n- <#372087003669331969> – Here you can discuss Avatar related comics, novels, and fan fictions! 
                        \n- <#498253602788343827> – Discuss the latest weekly topic, as long as it's within the rules!
                        \n- <#372098279615496192> – Posts content directly from our partnered subreddit and the official ATLA YouTube channel.`
                    }
                ]
            })    
        }

        if (interaction.data.component_type === 2 && interaction.data.custom_id === "TeamButton") {
            interaction.defer(64); // Send initial response here to avoid the interaction token expiring after 3 seconds

            let wl = [];
            let sentries = [];
            let daili = [];
            let moverstars = [];

            let admins = this.bot.guilds.get('370708369951948800').members.filter(m =>
                (m.roles.includes('372084219423490049')));
                for (let i in admins) {
                    let member = await this.bot.getRESTUser(admins[i].id);
                    wl.push(this.utils.fullName(member));
                }
                let ind = wl.indexOf('twodog');
                wl.splice(ind, 1)[0];
                wl.unshift('twodog  |  Server Owner');
    
            let srmods = this.bot.guilds.get('370708369951948800').members.filter(m =>
                (m.roles.includes('1182448979288527029')) && (!m.roles.includes('372084219423490049')));
                for (let i in srmods) {
                    let member = await this.bot.getRESTUser(srmods[i].id);
                    sentries.push(this.utils.fullName(member));
                }
    
            let mods = this.bot.guilds.get('370708369951948800').members.filter(m =>
                (m.roles.includes('1182449762583191592')) && (!m.roles.includes('372084219423490049')));
                for (let i in mods) {
                    let member = await this.bot.getRESTUser(mods[i].id);
                    daili.push(this.utils.fullName(member));
                }

            let mvrstars = this.bot.guilds.get('370708369951948800').members.filter(m =>
                (m.roles.includes('1224072458206711928')) && (!m.roles.includes('372084219423490049')));
                for (let i in mvrstars) {
                    let member = await this.bot.getRESTUser(mvrstars[i].id);
                    let memberFullName = this.utils.fullName(member)
                    if (wl.includes(memberFullName) || sentries.includes(memberFullName) || daili.includes(memberFullName)) continue;
                    moverstars.push(memberFullName);
                }

            return interaction.createMessage({
                flags: 64,
                embeds: [
                    /* {
                        color: this.utils.getColor('lotus'),
                        image: {
                            url: `https://cdn.discordapp.com/attachments/411903716996677639/1051295564601491556/staff2.png`
                        } 
                    },
                    */
                    {
                        color: this.utils.getColor('lotus'),
                        description: `The staff members are here to make sure that everyone has a great time, to answer questions related to the server, or if you have trouble figuring out the server and might have questions or suggestions! 
                        \nYou can also DM us through our modmail, <@718577208687460482>, and a staff member will respond to you as soon as possible!`,                   
                    },
                    {
                        color: this.utils.getColor('whitelotus'),
                        thumbnail: {
                            url: `https://cdn.discordapp.com/role-icons/372084219423490049/902dcd91993b5ad9af73b0057473b0dd.png?quality=lossless`
                        },
                        title: `White Lotus - Admins`,
                        description: `The server admins. They handle operations regarding server management.\n\n${wl.join('\n')}`
                    },
                    {
                        color: this.utils.getColor('sentry'),
                        thumbnail: {
                            url: `https://cdn.discordapp.com/role-icons/1182448979288527029/2779c1a6e89ef34940c8b763990dc1a5.png?quality=lossless`
                        },
                        title: `Sentry - Senior Mods`,
                        description: `Sentries handle community moderation, as well as having a larger role in day-to-day community operations.\n\n${sentries.join('\n')}`
                    },
                    {
                        color: this.utils.getColor('daili'), 
                        thumbnail: {
                            url: `https://cdn.discordapp.com/role-icons/1182449762583191592/a18ecc6e56d679bc4e4a4cd924826cab.png?quality=lossless`
                        },
                        title: `Dai Li - Mods`,
                        description: `The Dai Li, together with Sentries, enforce our rules and maintain a friendly environment.\n\n${daili.join('\n')}`
                    },
                    {
                        color: this.utils.getColor('moverstars'), 
                        thumbnail: {
                            url: `https://cdn.discordapp.com/role-icons/1224072458206711928/85f4a7faf1da5e32217c47b0718be6dc.png?quality=lossless`
                        },
                        title: `Mover Stars - Community Engagement & Operations`,
                        description: `Mover Stars handle operations regarding our presence in the Avatar community and large-scale server events.\n\n${moverstars.join('\n')}`
                    }
                ],
            })
        }

        if (interaction.data.component_type === 2 && interaction.data.custom_id === "FAQ") {
            return interaction.createMessage({
                flags: 64,
                embeds: [
                    /* {
                        color: this.utils.getColor('lotus'),
                        image: {
                            url: `https://cdn.discordapp.com/attachments/411903716996677639/1040142190409678848/faq.png`
                        } 
                    },
                    */
                    {
                        color: this.utils.getColor('lotus'),
                        description: `## Where's the general chat?
                        \n- <#372087095121936385> and <#1033182943746723910> are the general off-topic chats\n- <#372086844956868618> and <#721604232532459540> are for ATLA and Legend of Korra discussions\n- Netflix's live-action adaptation of ATLA can be discussed in <#1120464986230239332>\n- New users who need a slower environment to ease into the server can chat in ⁠<#761932923217379338>\nBe sure to read the channel topics and the Channels section of this guide for more information.
                        \n\n## How do I level up?
                        \nYou level up by being active in the server. Posting messages can get you between 15 and 25 XP. However, spamming doesn't help, because you can only gain XP once per minute, regardless of the number of messages. If you want to know your individual rank, type \`!rank\` in <#372087473892884502>. If you want to see the leaderboard, use \`!top\` in the same bot channel.
                        \n\n## Why can't I post images/videos or links?
                        \nImage/file posting permissions are available to users that have the <@&720343753805660183> role. This role is automatically assigned after reaching **1,150 XP**. This is to prevent potential raids and spams by users who join the server for the first time.
                        \n\n## How can I choose a sub-bending role?
                        \nMembers with the <@&372163599130558466> role are granted access to our sub-bending roles located in <#1065945888507310191>. This role is automatically assigned after reaching **11,825 XP**.`
                    },
                ]
            })
        }
    }
}

module.exports = WelcomeMessage;
