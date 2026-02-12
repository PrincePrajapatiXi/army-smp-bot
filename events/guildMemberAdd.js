const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

// Helper function to add ordinal suffix (st, nd, rd, th)
function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const channel = member.guild.channels.cache.find(ch => ch.name === config.welcomeChannelName);
        if (!channel) return;

        const accountAge = Date.now() - member.user.createdTimestamp;
        const daysOld = Math.floor(accountAge / (1000 * 60 * 60 * 24));
        const memberCount = member.guild.memberCount;

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            // Dynamic Title: Fetches the server name automatically
            .setTitle(`Welcome to ${member.guild.name}, ${member.user.username}!`)
            .setDescription(`We are glad to have you here! Make sure to read the rules.`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'Account Age', value: `${daysOld} days old`, inline: true },
                // New Member Count Field with Ordinal Suffix
                { name: 'Member Count', value: `You are the **${getOrdinal(memberCount)}** member`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Army SMP Bot', iconURL: member.guild.iconURL() });

        channel.send({ content: `Welcome ${member}!`, embeds: [welcomeEmbed] });
    },
};
