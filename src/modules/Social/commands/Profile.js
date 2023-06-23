const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');
const { createCanvas, loadImage } = require('canvas');

class Profile extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'profile';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'profile',
            description: 'Displays the profile for yourself or another user',
            usage: 'profile [optional user]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 8000,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    displayName(message, member) {
        return (message).channel.guild.members.get(member).nick ?? (message).channel.guild.members.get(member).username;
    }

    async execute({ msg, args }) {

        let member = msg.channel.guild.members.get(args[0]) || msg.member;

        return profile.findOne({ _id: member.id }, async (err, doc) => {
            if (err) {
                return this.utils.logError(msg, err, 'db', 'Something went wrong.');

            } else if (!doc || doc.data === null) {
                return this.sendError(msg.channel, `This user does not have a profile yet.`);
            };

            const serverRank = await profile.find({ 'data.xp.id': msg.channel.guild.id })
            // .then(docs => Promise.resolve(docs.sort((A,B) => B.data.xp.find(x => x.id === msg.channel.guild.id).xp - A.data.xp.find(x => x.id === msg.channel.guild.id).xp)))
            .then(docs => Promise.resolve(docs.sort((A,B) => B.data.global_xp - A.data.global_xp)))
            .then(sorted => sorted.findIndex(x => x._id === doc._id) + 1);

            // const serverData = doc.data.xp.find(x => x.id === msg.channel.guild.id) || 1
            const serverData =  { xp: doc.data.global_xp, level: doc.data.global_level } || 1
            const cap = (50 * Math.pow(serverData.level, 2)) + (250 * serverData.level) || 1;
            const lowerLim = (50 * Math.pow(serverData.level - 1, 2)) + (250 * (serverData.level - 1));
            const range = cap - lowerLim;
            const currentXP = serverData.xp - lowerLim || 1;
            const percentDiff = currentXP / range;

            const canvas = createCanvas(800,600);
            const ctx = canvas.getContext('2d');
            const color = doc.data.profile.color || 'rgb(137, 207, 240)'

            const hat = doc.data.profile.hat ? await loadImage(doc.data.profile.hat) : null;
            const emblem = doc.data.profile.emblem ? await loadImage(doc.data.profile.emblem) : null;
            const wreath = doc.data.profile.wreath ? await loadImage(doc.data.profile.wreath) : null;
            const def = await loadImage(doc.data.profile.background || 'https://i.imgur.com/gcd6h3O.jpg');
            const defpattern = await loadImage(doc.data.profile.pattern || 'https://i.imgur.com/nx5qJUb.png');
            const avatar = await loadImage(member.user.avatarURL);

            // Add wallpaper
            ctx.drawImage(def,300,65,475,250);

            // Add bio card
            ctx.beginPath();
            ctx.moveTo(300,315);
            ctx.lineTo(canvas.width-5,315);
            ctx.lineTo(canvas.width-5,canvas.height-25);
            ctx.lineTo(300, canvas.height - 25);
            ctx.fillStyle = 'rgba(255,255,255,0.8)'
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 40;
            ctx.shadowOffsetX = -10;
            ctx.shadowOffsetY = -40;
            ctx.fill();

            // Add bio outline
            ctx.beginPath();
            ctx.moveTo(370, 338);
            ctx.lineTo(canvas.width-40, 338)
            ctx.arcTo(canvas.width-20, 338, canvas.width - 20, 358, 20);
            ctx.lineTo(canvas.width-20, 378)
            ctx.arcTo(canvas.width -20, 398, canvas.width - 40, 398, 20);
            ctx.lineTo(330, 398)
            ctx.arcTo(310,398,310,378,20)
            ctx.lineTo(310, 358)
            ctx.arcTo(310,338,330,338,20)
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0,0,0,0.4)'
            ctx.stroke();

            // Add bio title
            ctx.beginPath();
            ctx.font = 'bold 20px sans-serif'
            ctx.fillStyle = 'rgba(0,0,0,0.4)'
            ctx.fillText('BIO', 330, 345, 50)

            // Add bio text to bio carrd
            ctx.beginPath();
            ctx.font = '15px sans-serif'
            ctx.fillStyle = 'rgba(0,0,0,0.8)'
            ctx.textAlign = 'center'
            ctx.fillText(doc.data.profile.bio, 555, 368, 490)

            // Add birthday outline
            ctx.beginPath();
            ctx.moveTo(410, 419);
            ctx.lineTo(520,419);
            ctx.arcTo(540,419,540,439,20);
            ctx.arcTo(540,459,520,459,20);
            ctx.lineTo(330,459);
            ctx.arcTo(310,459,310,439,20);
            ctx.arcTo(310,419,320,419,20);
            ctx.stroke();

            // Add birthday title
            ctx.beginPath();
            ctx.font = 'bold 18px sans-serif'
            ctx.fillStyle = 'rgba(0,0,0,0.4)'
            ctx.textAlign = 'left'
            ctx.fillText('BIRTHDAY', 330, 425, 80)

            // Add birthday text to birthday card
            ctx.beginPath();
            ctx.font = '15px sans-serif'
            ctx.fillStyle = 'rgba(0,0,0,0.8)'
            ctx.fillText(doc.data.profile.birthday || 'Not Set', 330, 445, 230)

            // Add balance outline
            ctx.beginPath();
            ctx.moveTo(410,479);
            ctx.lineTo(520,479);
            ctx.arcTo(540,479,540,499,20);
            ctx.lineTo(540,509);
            ctx.arcTo(540,529,520,529,20);
            ctx.lineTo(330,529);
            ctx.arcTo(310,529,310,509,20);
            ctx.lineTo(310,499);
            ctx.arcTo(310,479,330,479,20);
            ctx.stroke();

            // Add balance title
            ctx.beginPath();
            ctx.font = 'bold 18px sans-serif'
            ctx.fillStyle = 'rgba(0,0,0,0.4)'
            ctx.fillText('BALANCE', 330, 485, 80)

            // Add balance text to balance card
            ctx.beginPath();
            ctx.font = '18px sans-serif'
            ctx.fillStyle = 'rgba(0,0,0,0.8)'
            // await fillTextWithTwemoji(ctx, `💴: ${doc.data.economy.wallet || '0'}`, 330, 512, 80)
            // await fillTextWithTwemoji(ctx, `🏦: ${doc.data.economy.bank || '0'}`, 430, 512, 80)
            ctx.fillText(`Bal: ${doc.data.economy.wallet || '0'}`, 330, 512, 80)
            ctx.fillText(`Bank: ${doc.data.economy.bank || '0'}`, 430, 512, 80)

            // Add emblem indicator
            if (!emblem){
                ctx.beginPath();
                ctx.fillStyle = 'rgba(0,0,0,0.4)'
                ctx.font = 'bold 25px sans-serif'
                ctx.textAlign = 'center'
                ctx.fillText('NO', 660 , 469, 150)
                ctx.fillText('EMBLEM', 660, 500, 150)
            } else {
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 10;
                ctx.shadowOffsetY = 10;
                ctx.beginPath();
                ctx.drawImage(emblem,580,400,160,160);
            };


            // Add the tip shape
            ctx.beginPath();
            ctx.moveTo(800,10);
            ctx.lineTo(575,10);
            ctx.lineTo(600,80);
            ctx.lineTo(800,80);
            ctx.fillStyle = color;
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 30;
            ctx.fill();

            // Write tip on tip shape
            ctx.beginPath();
            ctx.font = 'bold 30px sans-serif'
            ctx.fillStyle = 'rgba(255,255,255,0.8)'
            ctx.textAlign = 'left'
            ctx.fillText('REP',610,50,50)

            // Write received tips on tip shape
            ctx.beginPath();
            ctx.font = 'bold 30px sans-serif'
            ctx.textAlign = 'right'
            ctx.fillText(doc.data.tips.received, canvas.width - 30, 50, 120)

            // Reset shadow
            ctx.shadowOffsetY = 0;

            // Add card on left side
            // Add pattern inside card
            ctx.fillStyle = 'rgba(255,255,255,1)'
            ctx.beginPath();
            ctx.moveTo(0,65);
            ctx.lineTo(0,535);
            ctx.arcTo(0,585,50,585,50);
            ctx.lineTo(250,585);
            ctx.lineTo(300,585);
            ctx.arcTo(300,15,250,15,50);
            ctx.lineTo(50,15);
            ctx.arcTo(0,15,0,65,50);
            ctx.stroke();
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 10;
            ctx.fill();
            ctx.save();
            ctx.clip();
            ctx.drawImage(defpattern,0,0,300,600);
            ctx.restore();

            // Reset shadow
            ctx.shadowOffsetX = 0;

            // Add wavy shape below the pattern
            ctx.beginPath();
            ctx.moveTo(0, 255);
            ctx.bezierCurveTo(0,265,50,265,50,255);
            ctx.bezierCurveTo(50,245,100,245,100,255);
            ctx.bezierCurveTo(100,265,150,265,150,255);
            ctx.bezierCurveTo(150,245,200,245,200,255);
            ctx.bezierCurveTo(200,265,250,265,250,255);
            ctx.bezierCurveTo(250,245,300,245,300,255);
            ctx.lineTo(300,585);
            ctx.lineTo(50,585);
            ctx.arcTo(0,585,0,535,50);
            ctx.fillStyle = color
            ctx.fill();
            ctx.shadowBlur = 0;

            // Add name
            ctx.beginPath()
            ctx.font = 'bold 30px sans-serif'
            ctx.fillStyle = '#ffffff'
            ctx.textAlign = 'center'
            ctx.fillText(this.displayName(msg, member.id), 150, 350, 280)
            ctx.font = '20px sans-serif'
            ctx.fillText(this.utils.fullName(member.user), 150, 375, 280)

            // Add xp
            ctx.arc(60,460,35,0,Math.PI*2);
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'rgba(0,0,0,0.4)';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(60,460,35,Math.PI * 1.5,Math.PI * 1.5 + (Math.PI * 2 * percentDiff || 1))
            ctx.strokeStyle = '#ffffff'
            ctx.stroke();

            ctx.beginPath();
            ctx.font = 'bold 25px sans-serif'
            ctx.fillStyle = '#ffffff'
            ctx.textAlign = 'center'
            ctx.fillText(serverData.level || '1', 60,460,35)
            ctx.font = 'bold 15px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('LEVEL', 60, 480, 35)

            ctx.beginPath();
            ctx.arc(150,460,40,0,Math.PI * 2);
            ctx.fillStyle = '#ffffff'
            ctx.fill();

            ctx.beginPath();
            ctx.font = 'bold 30px sans-serif'
            ctx.fillStyle = color
            ctx.textAlign = 'center'
            ctx.fillText(serverRank ? this.utils.ordinalize(serverRank) : 'N/A', 150,460,50)
            ctx.font = 'bold 15px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('SERVER', 150, 480, 50)

            ctx.beginPath();
            ctx.arc(240,460,40,0,Math.PI * 2);
            ctx.fillStyle = '#ffffff'
            ctx.fill();

            ctx.beginPath();
            ctx.font = 'bold 30px sans-serif'
            ctx.fillStyle = color
            ctx.textAlign = 'center'
            ctx.fillText('N/A', 240,460,50)
            ctx.font = 'bold 15px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('GLOBAL', 240, 480, 50)

            // add avatar
            ctx.beginPath();
            ctx.arc(150,225,75, 0, Math.PI * 2);
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'rgba(0,0,0,0.6)'
            ctx.stroke();
            ctx.closePath();
            ctx.save();
            ctx.clip();
            ctx.drawImage(avatar,75,150,150,150);
            ctx.restore();

            // add wreath
            if (wreath){
                ctx.beginPath();
                ctx.drawImage(wreath,60,145,180,180);
            };

            if (hat){
                ctx.beginPath();
                ctx.drawImage(hat,0,0,300,300);
            };

            this.sendMessage(msg.channel, {
                file: [{
                    file: canvas.toBuffer(),
                    name: 'rank.png'
                }]
            });
        });
    }
};

module.exports = Profile;