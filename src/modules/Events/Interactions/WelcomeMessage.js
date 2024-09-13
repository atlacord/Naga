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
                    {
                        color: this.utils.getColor('lotus'),
                        image: {
                             url: `https://media.discordapp.net/attachments/831909387307319336/1051326858580467792/serverroles.png`
                        } 
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `**__Ranks__**
                        \nAs you gain XP in the server (see the FAQ section in this channel for more information about XP), you will automatically receive special rank roles:
                        
                        \n\n__1,150 XP__   • <@&720343753805660183> – Grants permissions to send images and embedded links.
                        \n__4,675 XP__     • <@&372178560254869504> - Grants access to Discord polls.
                        \n__11,825 XP__    • <@&372163599130558466> – Grants access to one sub-bending role of your choice, as well as permission to request the <@&830138455337730049> role (see "Requestable Roles" below).
                        \n__42,000 XP__    • <@&372179082634330112> 
                        \n__101,675 XP__   • <@&372179236842242048> - Allows a [Wiki](https://wiki.atla.sh/) page for the user.
                        \n__200,850 XP__   • <@&423269295930343424> 
                        \n__349,525 XP__   • <@&434950614997401600> - Allows custom bot commands, made in <#1093583806813970444>.
                        \n__557,700 XP__   • <@&811411225639518209> - Grants high level roles (Water Tribe Chief, Earth Monarch, Fire Lord, Monk and Cabbage Merchant) based on the bending of your choice.
                        \n__835,375 XP__   • <@&811411331621191721> 
                        \n__1,192,550 XP__ • <@&811411413573697556>`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `**__Requestable Roles__**
                        \nThe following roles cannot be self-assigned, but eligible users *who are in good standing with the staff team* may request them by DMing <@718577208687460482> Mod Mail:
                            
                        \n\n <@&830138455337730049>  – Given to members who want to host events here. Grants access to <#832247862988898334>, our channel where Event Masters organize and coordinate activities for the server. You must have the <@&372163599130558466> role (11,825 XP) to be eligible for the role; our staff team also reserves the right to remove this role from a user if they go a prolonged period without hosting any events.`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `**__Honorary Roles, Prize Roles, and Other Non-Assignable Roles__**
                        \n The following roles are not regularly available and can only be obtained under special circumstances:
                               
                        \n\n<@&787644908705153024> – A special birthday role given automatically by <@772934946200485938> to users on their birthday (UTC time). You must have your birthday added to your Naga profile for this to work; you can set this up by using the ` + '`n.setbirthday`' +  ` command in <#372087473892884502>.
                               
                        \n\n<@&709818677532557343> – A temporary (1-week) role given to the winner(s) of Avatar games that we hold in the server. To get notifications for when such games are held, grab yourself the <@&709837040895656028> role (see “Notification Roles” on our community onboarding page).
                               
                        \n\n<@&516790566017564684> – A temporary (1-month) role given to the winner(s) of contest events that we hold in the server. To get notifications for when such events are held, grab yourself the <@&497208797039689749> role (see “Notification Roles” below). After 1 month, this role is removed and replaced with <@&530972685610778635> instead.
                               
                        \n\n<@&586128911302131725> – An honorary role given automatically to server boosters. Grants access to <#826851222459514923>, our private chat channel for Team Avatar members.
                               
                        \n\n<@&433112551195279360> – A role used to temporarily mute server members who misbehave or break our rules (see <#1066580298290176121>), preventing them from typing in our chats. This role is removed automatically once the mute duration has been served. To find your mute reason and duration, check the DM you should have received from <@!380453326216626176> (you need to have your DMs open to receive this).`
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
                    {
                        color: this.utils.getColor('lotus'),
                        image: {
                            url: `https://cdn.discordapp.com/attachments/411903716996677639/1051303245957570581/channels2.png`
                        } 
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696>**SERVER GUIDE**<:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                        \n- <#1066580298290176121> - Our server rules. Be sure to read them before participating in the server!
                        \n- <#1053064927935467530> - The channel you're in now! The important information hub of the server. 
                        \n- <#1065945888507310191> - Our channel for assigning level-restricted roles (eg. sub-bending)!
                        \n- <#1066599364967006228> - Our partnered Discord servers which you can also join and enjoy!
                        \n- <#529791576545951744> - Our hall of fame for past contest winners!`
                    },
                    { 
                        color: this.utils.getColor('lotus'),
                        description:`<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **BULLETIN** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                        \n- <#372088315467399170> – For announcing news, updates and special occasions.
                        \n- <#831063798873587743> – For announcing community events such as streams, gaming/book/music nights and much more!
                        \n- <#835240650051944469> – For announcing news related to the Avatar Universe.
                        \n- <#782411596679872542> – Channel for all minor server changes and updates for channels and features.
                        \n- <#773478447242674207> – For announcing all server giveaways! Entry requirements will still be limited to certain level roles by <@!380453326216626176>.
                        \n- <#1007044599287656559> – For announcing Birthdays of our server members! Info on how to sign up in this channel. 
                        \nBe sure to give yourself appropriate roles in <id:customize> for notifications in all previously listed channels!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **GENERAL** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                        \n- <#761932923217379338> – Channel for the arrival of new members and for us to greet them!
                        \n- <#826851222459514923> – A private channel for server boosters.
                        \n- <#372087095121936385> – Our general chat of the server, off-topic conversations and A:TLA&TLOK talk is allowed.
                        \n- <#1033182943746723910> — A forum channel for users to discuss general topics at their own pace. Anything goes!
                        \n- <#372087205063163907> – Post your memes and other videos and images here. No NSFW/NSFL content and any content that breaks the rules.
                        \n- <#719848144719970324> – The best jokes and moments go here.`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **AVATAR** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                        \n- <#372086844956868618> – The main channel for Avatar: The Last Airbender discussions.
                        \n- <#721604232532459540> – The main channel for Legend of Korra discussions.
                        \n- <#1120464986230239332> — Discuss Netflix's live-action adaptation of Avatar: The Last Airbender here!
                        \n- <#372087003669331969> – Here you can discuss Avatar related comics, novels, and fan fictions! 
                        \n- <#498253602788343827> – Discuss the latest weekly topic, as long as it's within the rules!
                        \n- <#709827097559826553> – Avatar Games channel that opens periodically when a game is hosted. Users with the Avatar Games role will be notified when it's open.
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
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **META** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                        \n- <#1093583806813970444> — Post your suggestions here for the staff to review!
                        \n- <#794360973963165716> – Place your emote ideas which you would like to see in the server!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **MISCELLANEOUS** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                        \n- <#726405096132575322> – For pictures of your pets, food, or any other amazing things you'd like to share.
                        \n- <#372087240270151680> – For all forms of art! Be sure to credit the artist by posting a link to the source. Discussions of these works should be done in <#884990489756045332>! Infringement and theft of intellectual property is forbidden and subject to punishment by rule 6 in <#1066580298290176121>.
                        \n- <#884990489756045332> – For discussing art or other creative works posted in <#372087240270151680>!
                        \n- <#487958065690312724> – For discussing sports, music, movies, TV shows, games or books! Be sure to use spoiler tags if something recently released is being discussed! Any announcements regarding gaming offers will be posted and pinned in this channel too! 
                        \n- <#902485012337799189> – For wholesome content of all forms such as nice things that happened in life, or wholesome things from around Discord!   `
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **SATO'S WORKSHOP** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                        \n- <#829563592173027369> – Channel for playing with our <@772934946200485938> multi-purpose bot through various games!
                        \n- <#1004827258210504754> –  Secondary channel for playing with the Naga bot, same as above.
                        \n- <#372087473892884502> – The standard channel for sending bot commands.
                        \n- <#418988592740958208> – The Trivia Rumble channel for playing Trivia games with our custom <@631650441477750808> trivia bot!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **VOICE CHANNELS** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
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
                    {
                        color: this.utils.getColor('lotus'),
                        image: {
                            url: `https://cdn.discordapp.com/attachments/411903716996677639/1051303245957570581/channels2.png`
                        } 
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696>**SERVER GUIDE**<:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                        \n- <#1066580298290176121> - Our server rules. Be sure to read them before participating in the server!
                        \n- <#1053064927935467530> - The channel you're in now! The important information hub of the server. 
                        \n- <#1065945888507310191> - Our channel for assigning level-restricted roles (eg. sub-bending)!
                        \n- <#1066599364967006228> - Our partnered Discord servers which you can also join and enjoy!
                        \n- <#529791576545951744> - Our hall of fame for past contest winners!`
                    },
                    { 
                        color: this.utils.getColor('lotus'),
                        description:`<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **BULLETIN** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                        \n- <#372088315467399170> – For announcing news, updates and special occasions.
                        \n- <#831063798873587743> – For announcing community events such as streams, gaming/book/music nights and much more!
                        \n- <#835240650051944469> – For announcing news related to the Avatar Universe.
                        \n- <#782411596679872542> – Channel for all minor server changes and updates for channels and features.
                        \n- <#773478447242674207> – For announcing all server giveaways! Entry requirements will still be limited to certain level roles by <@!380453326216626176>.
                        \n- <#1007044599287656559> – For announcing Birthdays of our server members! Info on how to sign up in this channel. 
                        \nBe sure to give yourself appropriate roles in <id:customize> for notifications in all previously listed channels!`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **GENERAL** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                        \n- <#761932923217379338> – Channel for new users to chat in and get acquainted with the community until they feel comfortable to chat in the general chats regularly!
                        \n- <#826851222459514923> – A private channel for server boosters.
                        \n- <#372087095121936385> – Our general chat of the server, off-topic conversations and A:TLA&TLOK talk is allowed.
                        \n- <#1033182943746723910> — A forum channel for users to discuss general topics at their own pace. Anything goes!
                        \n- <#372087205063163907> – Post your memes and other videos and images here. No NSFW/NSFL content and any content that breaks the rules.
                        \n- <#719848144719970324> – The best jokes and moments go here.`
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **AVATAR** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                        \n- <#372086844956868618> – The main channel for Avatar: The Last Airbender discussions.
                        \n- <#721604232532459540> – The main channel for Legend of Korra discussions.
                        \n- <#1120464986230239332> — Discuss Netflix's live-action adaptation of Avatar: The Last Airbender here!
                        \n- <#372087003669331969> – Here you can discuss Avatar related comics, novels, and fan fictions! 
                        \n- <#498253602788343827> – Discuss the latest weekly topic, as long as it's within the rules!
                        \n- <#709827097559826553> – Avatar Games channel that opens periodically when a game is hosted. Users with the Avatar Games role will be notified when it's open.
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
                    moverstars.push(this.utils.fullName(member));
                }

            return interaction.createMessage({
                flags: 64,
                embeds: [
                    {
                        color: this.utils.getColor('lotus'),
                        image: {
                            url: `https://cdn.discordapp.com/attachments/411903716996677639/1051295564601491556/staff2.png`
                        } 
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `The staff members are here to make sure that everyone has a great time, to answer questions related to the server, or if you have trouble figuring out the server and might have questions or suggestions! 
                        \nYou can also DM us through our modmail, <@718577208687460482>, and a staff member will respond to you as soon as possible!`,                   
                    },
                    {
                        color: this.utils.getColor('whitelotus'),
                        thumbnail: {
                            url: `https://cdn.discordapp.com/emojis/889079239146627122.webp?size=160&quality=lossless`
                        },
                        title: `White Lotus - Admins`,
                        description: `The server admins. They handle operations regarding server management.\n\n${wl.join('\n')}`
                    },
                    {
                        color: this.utils.getColor('sentry'),
                        thumbnail: {
                            url: `https://cdn.discordapp.com/emojis/771008569431949312.webp?size=80&quality=lossless`
                        },
                        title: `Sentry - Senior Mods`,
                        description: `Sentries handle community moderation, as well as having a larger role in day-to-day community operations.\n\n${sentries.join('\n')}`
                    },
                    {
                        color: this.utils.getColor('daili'), 
                        thumbnail: {
                            url: `https://cdn.discordapp.com/attachments/761932330028892194/1051301088386633788/dai_li_tile.png`
                        },
                        title: `Dai Li - Mods`,
                        description: `The Dai Li, together with Sentries, enforce our rules and maintain a friendly environment.\n\n${daili.join('\n')}`
                    },
                    {
                        color: this.utils.getColor('moverstars'), 
                        thumbnail: {
                            url: `https://cdn.discordapp.com/emojis/1248340108374179950.webp?size=96&quality=lossless`
                        },
                        title: `Mover Stars - Community Engagement and Operations`,
                        description: `Mover Stars handle operations regarding our presence in the community and large-scale server events.\n\n${moverstars.join('\n')}`
                    }
                ],
            })
        }

        if (interaction.data.component_type === 2 && interaction.data.custom_id === "FAQ") {
            return interaction.createMessage({
                flags: 64,
                embeds: [
                    {
                        color: this.utils.getColor('lotus'),
                        image: {
                            url: `https://cdn.discordapp.com/attachments/411903716996677639/1040142190409678848/faq.png`
                        } 
                    },
                    {
                        color: this.utils.getColor('lotus'),
                        description: `**Q: Where's the general chat?**
                        \nA: <#372087095121936385> and <#1033182943746723910> are the general off-topic chats, while <#372086844956868618> and <#721604232532459540> are for ATLA and Legend of Korra discussions. New users who need a slower environment to ease into the server can chat in ⁠<#761932923217379338>. Be sure to read the channel topics and the Channels section of this guide for more information.
                        \n\n**Q: How do I level up?**
                        \nA: You level up by being active in the server. Posting messages can get you between 15 and 25 XP. However, spamming doesn't help, because you can only gain XP once per minute, regardless of the number of messages. If you want to know your individual rank, type \`!rank\` in <#372087473892884502>. If you want to see the leaderboard, use \`!top\` in the same bot channel.
                        \n\n**Q: Why can't I post images/videos or links?**
                        \nA: Image/file posting permissions are available to users that have the <@&720343753805660183> role. This role is automatically assigned after reaching **1,150 XP**. This is to prevent potential raids and spams by users who join the server for the first time.
                        \n\n**Q: How can I choose a sub-bending role?**
                        \nA: Members with the <@&372163599130558466> role are granted access to our sub-bending roles located in <#1065945888507310191>. This role is automatically assigned after reaching **11,825 XP**.`
                    },
                ]
            })
        }
    }
}

module.exports = WelcomeMessage;
