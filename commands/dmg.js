const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'dmg',
    description: 'Get information about the damage done in a battle',
    usage: '[Link to battle]',
    cooldown: 5,
    execute: async(message, args) => {
        if (!args.length) {
            message.channel.send('Please provide your a valid link!');
        } else {
            const arrString = args.toString();
            let srvRegexp = /alpha|secura|primera|suna|euforia|pandemia/gi;
            const getServer = arrString.match(srvRegexp);
            let battleRegexp = /\d+/i;
            const getBattleID = arrString.match(battleRegexp)

            if (getBattleID === null || getServer === null) {
                message.channel.send('Please provide a valid server or battle!');
            } else {
                try {
                    let apFights = `https://${getServer}.e-sim.org/apiFights.html?battleId=${getBattleID}`
                    let fightsData = await fetch(apFights).then(response => response.text());
                    const fightsDataParse = JSON.parse(fightsData)
                    let defDmg = 0;
                    let defQ0w = 0;
                    let defQ1w = 0;
                    let defQ5w = 0;
                    let attDmg = 0;
                    let attQ0w = 0;
                    let attQ1w = 0;
                    let attQ5w = 0;
                    for (const el in fightsDataParse) {
                        if (fightsDataParse[el].defenderSide === true) {
                            defDmg += fightsDataParse[el].damage
                            if (fightsDataParse[el].weapon == 5 && fightsDataParse[el].berserk === true) {
                                defQ5w += 5;
                            } else if (fightsDataParse[el].weapon == 5 && fightsDataParse[el].berserk === false) {
                                defQ5w += 1;
                            } else if (fightsDataParse[el].weapon == 0 && fightsDataParse[el].berserk === true) {
                                defQ0w += 5;
                            } else if (fightsDataParse[el].weapon == 0 && fightsDataParse[el].berserk === false) {
                                defQ0w += 1;
                            } else if (fightsDataParse[el].weapon == 1 && fightsDataParse[el].berserk === true) {
                                defQ1w += 5;
                            } else if (fightsDataParse[el].weapon == 1 && fightsDataParse[el].berserk === false) {
                                defQ1w += 1;
                            }
                        } else if (fightsDataParse[el].defenderSide === false) {
                            attDmg += fightsDataParse[el].damage
                            if (fightsDataParse[el].weapon == 5 && fightsDataParse[el].berserk === true) {
                                attQ5w += 5;
                            } else if (fightsDataParse[el].weapon == 5 && fightsDataParse[el].berserk === false) {
                                attQ5w += 1;
                            } else if (fightsDataParse[el].weapon == 0 && fightsDataParse[el].berserk === true) {
                                attQ0w += 5;
                            } else if (fightsDataParse[el].weapon == 0 && fightsDataParse[el].berserk === false) {
                                attQ0w += 1;
                            } else if (fightsDataParse[el].weapon == 1 && fightsDataParse[el].berserk === true) {
                                attQ1w += 5;
                            } else if (fightsDataParse[el].weapon == 1 && fightsDataParse[el].berserk === false) {
                                attQ1w += 1;
                            }
                        }
                    }
                    let defDmgParse = defDmg.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                    let defQ0Parse = defQ0w.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                    let defQ1Parse = defQ1w.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                    let defQ5Parse = defQ5w.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                    let attDmgParse = attDmg.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                    let attQ0Parse = attQ0w.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                    let attQ1Parse = attQ1w.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                    let attQ5Parse = attQ5w.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

                    let apiBattle = `https://${getServer}.e-sim.org/apiBattles.html?battleId=${getBattleID}`
                    let battleData = await fetch(apiBattle).then(response => response.text());
                    const battleDataParse = JSON.parse(battleData);
                    let defID = 0;
                    let attID = 0;
                    let regionID = 0
                    for (const el in battleDataParse) {
                        defID += battleDataParse[el].defenderId;
                        attID += battleDataParse[el].attackerId;
                        regionID += battleDataParse[el].regionId;
                    }

                    let apiCountries = `https://${getServer}.e-sim.org/apiCountries.html`
                    let countriesData = await fetch(apiCountries).then(response => response.text());
                    const countriesDataParse = JSON.parse(countriesData);
                    const formatCountry = countriesDataParse.reduce((acc, country) => (acc[country.id] = country, acc), {});

                    let apiRegions = `https://${getServer}.e-sim.org/apiRegions.html`;
                    let regionsData = await fetch(apiRegions).then(response => response.text());
                    const regionsDataParse = JSON.parse(regionsData);
                    const formatRegion = regionsDataParse.reduce((acc, region) => (acc[region.id] = region, acc), {})

                    const citizenEmbed = new Discord.MessageEmbed()
                        .setColor('#8b0000')
                        .setTitle(`Battle for ${formatRegion[regionID].name}`)
                        .setURL(`${args.toString()}`)
                        .setThumbnail('https://media.discordapp.net/attachments/671877030240976896/710984584531017848/0054ac199cfee190c8315a5755771e47.png')
                        .addField('\u200b', '\u200b')
                        .addField(`🛡️`, `**${formatCountry[defID].name}:**`)
                        .addField('Q1 Weps', `${defQ1Parse}`, true)
                        .addField('Q5 Weps', `${defQ5Parse}`, true)
                        .addField('Damage', `${defDmgParse}`, true)
                        .addField('\u200b', '\u200b')
                        .addField(`⚔️`, `**${formatCountry[attID].name}:**`)
                        .addField('Q1 Weps', `${attQ1Parse}`, true)
                        .addField('Q5 Weps', `${attQ5Parse}`, true)
                        .addField('Damage', `${attDmgParse}`, true)
                        .setTimestamp();
                    message.channel.send(citizenEmbed);
                } catch (e) {
                    console.log(e)
                    message.channel.send('Whoops, something went wrong, try again!')
                }
            }

        }
    }
}