const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const channel = member.guild.channels.cache.find(ch => ch.name === config.welcomeChannelName);
        if (!channel) return;

        const accountAge = Date.now() - member.user.createdTimestamp;
        const daysOld = Math.floor(accountAge / (1000 * 60 * 60 * 24));

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Welcome to Army SMP, ${member.user.username}!`)
            .setDescription(`We are glad to have you here! Make sure to read the rules.`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'Account Age', value: `${daysOld} days old`, inline: true },
                { name: 'User ID', value: `${member.id}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Army SMP Bot', iconURL: member.guild.iconURL() });

        channel.send({ content: `Welcome ${member}!`, embeds: [welcomeEmbed] });
    },
};
