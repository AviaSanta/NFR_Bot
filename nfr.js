const Discord = require("discord.js");
const client = new Discord.Client();
const rbx = require("noblox.js");

client.on("ready", () => {
    console.log("Bot online!");
    client.user.setActivity("Tigerair Entries.", { type: 'WATCHING' });
});

client.on("message", async msg => {
    if(msg.content == "-verify"){
        let msgOne = await msg.channel.send("Please follow these instructions to get you verified and ready to fly.")
  
        function makeid(){
            var text = "";
            var selectFruit = ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😲','😝','🤑','🤯','😭','😑','😶','😋','🙆','👉','👇','🧠','💼','👮🏻','👍🏼','👎🏼','🐵','🌨','☁️','💧','🎬','🎧','🎮','🎲','🏅','🥇','🥈','🥉','🏆','🏒','🍎','🍫','🍿','🍪','🥛','🍽','🍴','🐑','🦀','🐔','🐭','🦊','🐧','🐞','🌍','🌏','🌕','🌖','🌚','🌝','🌵','🎄','🌲','☀️','⛅️','☔️','🍋'];
            text += selectFruit[Math.floor(Math.random() * selectFruit.length)];
            text += selectFruit[Math.floor(Math.random() * selectFruit.length)];
            text += selectFruit[Math.floor(Math.random() * selectFruit.length)];
            text += selectFruit[Math.floor(Math.random() * selectFruit.length)];
            return text;
        }
      
        const filter = m => m.author.id === msg.author.id
        const collector = msg.channel.createMessageCollector(filter, { max: '1', maxMatches: "1", time: "200000" })
        const robloxEmbed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle("Prompt")
            .setDescription("What's your ROBLOX username?")
            .setFooter("This prompt will cancel after 200 seconds.")
            .setTimestamp()
        
            msg.channel.send(robloxEmbed)
        
        collector.on("collect", m => {
            if(m.content === 'cancel' || m.content === 'Cancel') {
                msg.channel.send('**Cancelled prompt.**')
                return
            }
            
            rbx.getIdFromUsername(m.content).then(foundId => {
            const Id = foundId
            const newString = makeid() + makeid() + makeid() + makeid() + makeid()
            const foundUsername = new Discord.MessageEmbed()
                .setColor("YELLOW")
                .setTitle("Prompt")
                .setDescription("Hello **" + m.content + "**, to verify that you are that user. Please put this in your blurb, or status. \n `" + newString + "`\n\nSay **done** when complete.\nSay **cancel** to cancel. ")
                .setFooter("Player ID is " + foundId)
                .setTimestamp()
            msg.channel.send(foundUsername)
            
            const collector2 = msg.channel.createMessageCollector(filter, { max: '1', maxMatches: "1", time: "200000" })
            
            collector2.on('collect', async mag => {
                if(mag.content.includes('done') & mag.content.includes("done") && mag.author.id == msg.author.id){
                    const fetchingBlurb = new Discord.MessageEmbed()
                        .setColor("YELLOW")
                        .setTitle("Prompt")
                        .setDescription("Fetching your emojis, please wait as I am going to fetch it.")
                        .setFooter("Fetching..")
                        .setTimestamp()
                    msg.channel.send(fetchingBlurb)
                    
                    setTimeout(function(){
                        rbx.getStatus(foundId).then(status => {
                            rbx.getBlurb(foundId).then(blurb => {
                                if(status.includes(newString) || blurb.includes(newString)) {
                        
                                    const verified = new Discord.MessageEmbed()
                                        .setColor("ORANGE")
                                        .setTitle("Prompt")
                                        .setDescription("You have now been verified! Please wait shortly as you are going to recieve the Verified Role. Please have a read of #information and enjoy the server.")
                                        .setFooter("Verifying..")
                                        .setTimestamp() 
                                    msg.channel.send(verified)
                                    msg.member.roles.add(msg.guild.roles.cache.find(r => r.name == "V | Verified","P | Passenger"))
                                    msg.member.setNickname(m.content)
                                }else{
                                    msg.channel.send("Can not find the emojis.")
                                }
                            });
                        }, 5000)
                    });
                }else{
                    if(mag.content.includes('cancel') && mag.author.id == msg.author.id){
                        msg.channel.send('**Cancelled prompt.**')
                        return
                    }
                }
            });
        });
    });
}
});

client.login(process.env.token);