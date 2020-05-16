const rp = require('request-promise');
const Discord = require('discord.js');
const $ = require('cheerio');
const fetch = require('node-fetch');
const querystring = require('querystring');
const { servers } = require('../utils/servers.json');

module.exports = {
    name: 'buff',
    description: 'Get citizen buffs or debuffs',
    usage: '[Server] [Citizen name]',
    execute: async(message, args) => {
        if (args.length < 2) {
            message.channel.send('Please provide a server and a username!')
        } else {
            let chosenServer = servers.reduce((r, v) => args[0].includes(v.toLowerCase()) && v || r, '')
            if (chosenServer == servers[0] || chosenServer == servers[1] || chosenServer == servers[2] ||
                chosenServer == servers[3] || chosenServer == servers[4] || chosenServer == servers[5]) {
                const server = chosenServer;
                const username = args.slice(1);
                const query = querystring.stringify({ name: username.join(' ') });
                try {
                    const apiCitizenByName = `https://${server}.e-sim.org/apiCitizenByName.html?${query}`;
                    let citizenData = await fetch(apiCitizenByName).then(response => response.text());
                    const citizenDataParse = JSON.parse(citizenData);
                    const citizenURL = `https://${server}.e-sim.org/profile.html?id=${citizenDataParse.id}`;
                    const thumbnail = `https://media.discordapp.net/attachments/671877030240976896/711202376064958524/unknown.png`;
                    const imageArr = [];
                    let buffs = '';
                    let debuffs = '';
                    rp(citizenURL).then(function(html) {
                        $('div .profile-row img', html).each(function(a, b) {
                            const image = $(this).attr('src');
                            if (image && image.match('cdn.e-sim.org//img/specialItems/')) {
                                imageArr.push(image);
                            } else if (!image) {
                                message.channel.send('Player does not currently have any buffs or debuffs!')
                            }
                        });
                        const regex = '//cdn';
                        const resArr = imageArr.map(function(x) {
                            return x.replace(regex, 'https://cdn');
                        });
                        resArr.forEach((buff, i) => {
                            let name = buff.split("specialItems/")[1].split("_")[0];
                            let type = buff.split("_")[1].split(".")[0];

                            if (name == "resistance") name = "sewer";

                            if (type == "positive" && i == 0) buffs += (name.charAt(0).toUpperCase() + name.slice(1))
                            if (type == "positive" && i != 0) buffs += (", " + name.charAt(0).toUpperCase() + name.slice(1))

                            if (type == "negative" && i == 0) debuffs += (name.charAt(0).toUpperCase() + name.slice(1))
                            if (type == "negative" && i != 0) debuffs += (", " + name.charAt(0).toUpperCase() + name.slice(1))
                        });

                        let def = "None";

                        const buffsEmbed = new Discord.MessageEmbed()
                            .setColor('#8b0000')
                            .setTitle(`${citizenDataParse.login}`)
                            .setURL(`${citizenURL}`)
                            .setThumbnail(thumbnail)
                            .addField('\u200b', '\u200b')
                            .addField(`🟢 **Buffs:**`, `${buffs || def}`)
                            .addField('\u200b', '\u200b')
                            .addField('🔴 **Debuffs:**', `${debuffs || def}`)
                            .setTimestamp();
                        message.channel.send(buffsEmbed);
                    });
                } catch (e) {
                    console.log(e)
                    message.channel.send('Whoops, something went wrong, try again!')
                }
            }

        }
    }
}