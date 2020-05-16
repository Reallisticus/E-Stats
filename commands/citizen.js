const Discord = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');
const { servers } = require('../utils/servers.json');

module.exports = {
    name: 'citizen',
    description: 'Get information about an e-sim account.',
    usage: '[Server] [Citizen Name] ',
    cooldown: 5,
    execute: async(message, args) => {
        if (!args.length) {
            message.channel.send('Please provide your username and the server');
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

                    const militaryUnit = citizenDataParse.militaryUnitId;
                    const apiMuByID = `https://${server}.e-sim.org/apiMilitaryUnitById.html?id=${militaryUnit}`;
                    let muData = await fetch(apiMuByID).then(response => response.text());
                    const muDataParse = JSON.parse(muData);
                    const muURL = `https://${server}.e-sim.org/militaryUnit.html?id=${militaryUnit}`

                    const regionID = citizenDataParse.currentLocationRegionId;
                    const apiRegion = `https://${server}.e-sim.org/apiRegions.html`;
                    let regionData = await fetch(apiRegion).then(response => response.text());
                    const regionDataParse = JSON.parse(regionData);
                    const specificRegionURL = `https://${server}.e-sim.org/region.html?id=${regionID}`;
                    const formatRegion = regionDataParse.reduce((acc, region) => (acc[region.id] = region, acc), {})

                    const countryID = formatRegion[regionID].homeCountry;
                    const apiCountry = `https://${server}.e-sim.org/apiCountries.html`;
                    let countryData = await fetch(apiCountry).then(response => response.text());
                    const countryDataParse = JSON.parse(countryData);
                    const formatCountry = countryDataParse.reduce((acc, country) => (acc[country.id] = country, acc), {});
                    const citizenEmbed = new Discord.MessageEmbed()
                        .setColor('#8b0000')
                        .setTitle(`${citizenDataParse.login}`)
                        .setURL(`${citizenURL}`)
                        .addField('*Citizenship:*', citizenDataParse.citizenship, true)
                        .addField('*Level*', citizenDataParse.level, true)
                        .addField('*Damage:*', `${parseInt(citizenDataParse.totalDamage).toLocaleString()} dmg.`, true)
                        .addField('*Economy Skill:*', Math.round(citizenDataParse.economySkill * 100) / 100, true)
                        .addField('*XP*', `${parseInt(citizenDataParse.xp).toLocaleString() }`, true)
                        .addField('*Rank:*', citizenDataParse.rank, true)
                        .addField('\u200b', '\u200b')
                        .addField('*Premium:*', `${citizenDataParse.premiumDays} days remaining.`, true)
                        .addField('*Military Unit:*', `[${muDataParse.name}](${muURL})`, true)
                        .addField('\u200b', '\u200b')
                        .addField('*Daily damage:*', `${parseInt(citizenDataParse.damageToday).toLocaleString()} dmg`, true)
                        .addField('*Current region:*', `[${formatRegion[regionID].name}](${specificRegionURL}) / ${formatCountry[countryID].name}`, true)
                        .addField('\u200b', '\u200b')
                        .setTimestamp();
                    message.channel.send(citizenEmbed);
                } catch (e) {
                    console.error(e)
                    message.channel.send('Whoops, something went wrong, try again please!')
                }

            } else {
                message.channel.send('Wrong server name! Try again =)')
            }
        }
    }
}