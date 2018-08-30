const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const request = require('request');
const cheerio = require('cheerio');
require('./functions.js');

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async() =>{
    console.log(`${bot.user.username} is online`);
    bot.user.setActivity("VSCode");
});

bot.on("message", async(message) =>{
    if(message.author.bot)
        return;
    if(message.channel.type === "dm")
        return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].substring(1,messageArray[0].length);
    let args = messageArray.slice(1);

    if(cmd === `botinfo`){
        let icon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
        .setDescription("Bot Information")
        .setColor("#2ECC71")
        .setThumbnail(icon)
        .addField("Bot Name", bot.user.username)
        .addField("Created At", bot.user.createdAt);

        return message.channel.send(botembed);
    }

   

    if(cmd === `boat-skills`){
        var shipName="";
        for(var i=1;i<=messageArray.length-1;i++){
                if(messageArray[i]!='of' && messageArray[i]!='and'){
                shipName = shipName + messageArray[i].charAt(0).toUpperCase() + messageArray[i].slice(1);
                }
                else{
                    shipName = shipName + messageArray[i];
                }
            if(i === messageArray.length-1)
                break;
            shipName = shipName + "_";
        }
            request(`https://azurlane.koumakan.jp/${shipName}` , (error,response,html) =>{
                if(!error && response.statusCode == 200){
                    const $ = cheerio.load(html);
                    var skillName = [], skill = [];
                  
                    var skillembed = new Discord.RichEmbed()
                    .setDescription("Skills")
                    .setColor("#2ECC71");
                    $("table:has(th:contains('Skills')) tr").each(function(){
                        $(this).find("th:nth-child(3)").each(function(){
                            if($(this).text().length>1){
                                skillName.push($(this).text());
                            }
                            
                        });
                        $(this).find("td:nth-child(4)").each(function(){
                            if($(this).text().length>1){
                                skill.push($(this).text());
                            }
                        });
                   });
                   for(var i=0;i<skillName.length;i++){
                        skillembed.addField(skillName[i],skill[i]);
                    }   

                message.channel.send(skillembed);
            }      
        });
    }
   
   
        var shipName ="";
        var shipInitial = cmd;
        for(var i=0;i<=messageArray.length-1;i++){
            if(i==0){
                shipName = shipName + cmd.charAt(0).toUpperCase() + cmd.slice(1);
            }
            else{
                if(messageArray[i]!='of' && messageArray[i]!='and'){
                shipName = shipName + messageArray[i].charAt(0).toUpperCase() + messageArray[i].slice(1);
                }
                else{
                    shipName = shipName + messageArray[i];
                }
            }
            if(i === messageArray.length-1)
                break;
            shipName = shipName + "_";
        }

        if(cmd === `${shipInitial}`){
        
            request(`https://azurlane.koumakan.jp/${shipName}` , (error,response,html) =>{
                if(!error && response.statusCode == 200){
                    const $ = cheerio.load(html);
                    var name = $("#firstHeading").text().trim();
                    var a = $('<a />');
                    a.attr('href',`https://azurlane.koumakan.jp/${shipName}`);
                    a.text(name);
                    var image = $(`a[href*='/File:${shipName}Icon.png'] > img[alt='${name}Icon.png']`).attr('data-url');
                    var imageURL = `https://azurlane.koumakan.jp${image}`;
                    var nationality, hullType, idNo;
                    $("table:has(th:contains('ID No.'))").each(function(){
                        nationality = $(this).find("th:contains('Nationality')").next().text().trim();
                        hullType = $(this).find("th:contains('Hull Type')").next().text().trim();
                        idNo = $(this).find("th:contains('ID No.')").next().text().trim();
                    });

                    var shipInfo = new Discord.RichEmbed()
                    .setAuthor("Azur Lane Wiki")
                    .setColor("#4F545C")
                    .setTitle(name)
                    .setURL(`https://azurlane.koumakan.jp/${shipName}`)
                    .setDescription(`${nationality} ${hullType} (${idNo})`)
                    .setImage(imageURL);
                    
                    return message.channel.send(shipInfo);
             }
        });
    }

});

bot.login(botconfig.token);