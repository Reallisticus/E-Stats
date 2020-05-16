const fetch = require('node-fetch');
const { servers } = require('../utils/servers.json');

module.exports = {
    name: 'online',
    description: 'Get information about players that are currently online.',
    usage: '[Server] [Citizen Name] ',
    cooldown: 5,
    execute: async(message, args) => {
        if (!args.length) {
            message.channel.send('Please provide a server');
        } else {
            let chosenServer = servers.reduce((r, v) => args[0].includes(v.toLowerCase()) && v || r, '')
            if (chosenServer == servers[0] || chosenServer == servers[1] || chosenServer == servers[2] ||
                chosenServer == servers[3] || chosenServer == servers[4] || chosenServer == servers[5]) {
                const server = chosenServer;
                try {
                    let apiOnline = `https://${server}.e-sim.org/apiOnlinePlayers.html`
                    let onlineData = await fetch(apiOnline).then(response => response.text());
                    const onlineDataParse = JSON.parse(onlineData)


                    // console.log(formatOnline.login.toString())

                } catch (e) {
                    console.error(e)
                    message.channel.send('Whoops, something went wrong, try again please!');
                }

            }
        }
    }
}