const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Get information about my functionalities!',
    cooldown: 3,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push(`Currently I have the following commands:\n`);
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nIf you want to know how to use a specific command, please try typing ${prefix}help [command name]`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply(`please check your PMs, I have sent you a message!`);
                })
                .catch(e => {
                    console.error(e);
                    message.reply(`It appears that something went wrong, we will check this out shortly.`);
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            message.reply('Beep, unexisting command, try again.');
        }

        data.push(`**Name:** ${command.name}`);
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**CD:** ${command.cooldown || 3} seconds`);

        message.channel.send(data, { split: true });
    }

}