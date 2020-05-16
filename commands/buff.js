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
        if (!args.length) {
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

                    const imageArr = [];
                    const thumbnail = `https://media.discordapp.net/attachments/671877030240976896/711202376064958524/unknown.png`;

                    rp(citizenURL)
                        .then(function(html) {
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

                            let posResults = resArr.filter(x => x.toLowerCase().includes("positive"));
                            let roidsBuff = posResults.filter(x => x.toLowerCase().includes("steroids"));
                            let tankBuff = posResults.filter(x => x.toLowerCase().includes("tank"));
                            let bunkerBuff = posResults.filter(x => x.toLowerCase().includes("bunker"));
                            let sewerBuff = posResults.filter(x => x.toLowerCase().includes("resistance"));
                            let spaBuff = posResults.filter(x => x.toLowerCase().includes("spa"));
                            let vacBuff = posResults.filter(x => x.toLowerCase().includes("vacations"));

                            let negResults = resArr.filter(x => x.toLowerCase().includes("negative"));
                            let tankDebuff = negResults.filter(x => x.toLowerCase().includes("tank"));
                            let roidsDebuff = negResults.filter(x => x.toLowerCase().includes("steroids"));
                            let bunkerDebuff = negResults.filter(x => x.toLowerCase().includes("bunker"));
                            let sewerDebuff = negResults.filter(x => x.toLowerCase().includes("resistance"));;
                            let spaDebuff = negResults.filter(x => x.toLowerCase().includes("spa"));
                            let vacDebuff = negResults.filter(x => x.toLowerCase().includes("vacations"));

                            // if (roidsBuff.length > 0 && tankBuff.length > 0 && bunkerBuff.length > 0 &&
                            //     sewerBuff.length > 0 && spaBuff.length > 0 && vacBuff.length > 0) {
                            //     const embed = new Discord.MessageEmbed()
                            //         .setColor('#008000')
                            //         .setTitle(`${citizenDataParse.login}`)
                            //         .setURL(`${citizenURL}`)
                            //         .setThumbnail(thumbnail)
                            //         .addField('\u200b', '\u200b')
                            //         .addField(`🟢 **Buffs:**`, `Tank, Steroids, Bunker, Sewer, Spa, Vac`)
                            //         .setTimestamp();
                            //     message.channel.send(embed)
                            // } else if (roidsBuff.length > 0 && tankBuff.length > 0 && bunkerBuff.length > 0 &&
                            //     sewerBuff.length > 0 && spaBuff.length > 0 && vacBuff.length == 0) {
                            //     const embed = new Discord.MessageEmbed()
                            //         .setColor('#008000')
                            //         .setTitle(`${citizenDataParse.login}`)
                            //         .setURL(`${citizenURL}`)
                            //         .setThumbnail(thumbnail)
                            //         .addField('\u200b', '\u200b')
                            //         .addField(`🟢 **Buffs:**`, `Tank, Steroids, Bunker, Sewer, Spa`)
                            //         .setTimestamp();
                            //     message.channel.send(embed)
                            // } else if (roidsBuff.length > 0 && tankBuff.length > 0 && bunkerBuff.length > 0 &&
                            //     sewerBuff.length == 0 && spaBuff.length == 0 && vacBuff.length == 0) {
                            //     const embed = new Discord.MessageEmbed()
                            //         .setColor('#008000')
                            //         .setTitle(`${citizenDataParse.login}`)
                            //         .setURL(`${citizenURL}`)
                            //         .setThumbnail(thumbnail)
                            //         .addField('\u200b', '\u200b')
                            //         .addField(`🟢 **Buffs:**`, `Tank, Steroids, Bunker`)
                            //         .setTimestamp();
                            //     message.channel.send(embed)
                            // } else if (roidsBuff.length > 0 && tankBuff.length > 0 && bunkerBuff.length > 0 &&
                            //     sewerBuff.length > 0 && spaBuff.length == 0 && vacBuff.length == 0) {
                            //     const embed = new Discord.MessageEmbed()
                            //         .setColor('#008000')
                            //         .setTitle(`${citizenDataParse.login}`)
                            //         .setURL(`${citizenURL}`)
                            //         .setThumbnail(thumbnail)
                            //         .addField('\u200b', '\u200b')
                            //         .addField(`🟢 **Buffs:**`, `Tank, Steroids, Bunker, Sewer`)
                            //         .setTimestamp();
                            //     message.channel.send(embed)
                            // } else if (roidsBuff.length > 0 && tankBuff.length > 0 && bunkerBuff.length > 0 &&
                            //     sewerBuff.length == 0 && spaBuff.length == 0 && vacBuff.length == 0) {
                            //     const embed = new Discord.MessageEmbed()
                            //         .setColor('#008000')
                            //         .setTitle(`${citizenDataParse.login}`)
                            //         .setURL(`${citizenURL}`)
                            //         .setThumbnail(thumbnail)
                            //         .addField('\u200b', '\u200b')
                            //         .addField(`🟢 **Buffs:**`, `Tank, Steroids, Bunker`)
                            //         .setTimestamp();
                            //     message.channel.send(embed)
                            // } else if (roidsBuff.length > 0 && tankBuff.length > 0 && bunkerBuff.length == 0 &&
                            //     sewerBuff.length == 0 && spaBuff.length == 0 && vacBuff.length == 0) {
                            //     const embed = new Discord.MessageEmbed()
                            //         .setColor('#008000')
                            //         .setTitle(`${citizenDataParse.login}`)
                            //         .setURL(`${citizenURL}`)
                            //         .setThumbnail(thumbnail)
                            //         .addField('\u200b', '\u200b')
                            //         .addField(`🟢 **Buffs:**`, `Tank, Steroids`)
                            //         .setTimestamp();
                            //     message.channel.send(embed)
                            // } else if (roidsBuff.length > 0 && tankBuff.length == 0 && bunkerBuff.length == 0 &&
                            //     sewerBuff.length == 0 && spaBuff.length == 0 && vacBuff.length == 0) {
                            //     const embed = new Discord.MessageEmbed()
                            //         .setColor('#008000')
                            //         .setTitle(`${citizenDataParse.login}`)
                            //         .setURL(`${citizenURL}`)
                            //         .setThumbnail(thumbnail)
                            //         .addField('\u200b', '\u200b')
                            //         .addField(`🟢 **Buffs:**`, `Steroids`)
                            //         .setTimestamp();
                            //     message.channel.send(embed)
                            // } else if (roidsBuff.length == 0 && tankBuff.length > 0 && bunkerBuff.length == 0 &&
                            //     sewerBuff.length == 0 && spaBuff.length == 0 && vacBuff.length == 0) {
                            //     const embed = new Discord.MessageEmbed()
                            //         .setColor('#008000')
                            //         .setTitle(`${citizenDataParse.login}`)
                            //         .setURL(`${citizenURL}`)
                            //         .setThumbnail(thumbnail)
                            //         .addField('\u200b', '\u200b')
                            //         .addField(`🟢 **Buffs:**`, `Tank`)
                            //         .setTimestamp();
                            //     message.channel.send(embed)
                            // }

                            // const embed = new Discord.MessageEmbed()
                            //     .setTitle('test')
                            //     .attachFiles(['./utils/buff/steroids_positive.png'])
                            //     .setImage('attachment://steroids_positive.png');

                            // console.log(`${roidsBuff} ${tankBuff}`)
                        });


                } catch (e) {
                    console.log(e)
                    message.channel.send('Whoops, something went wrong, try again!')
                }
            }

        }
    }
}