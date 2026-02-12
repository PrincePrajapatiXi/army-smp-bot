const { AttachmentBuilder } = require('discord.js');
// Configuration file is no longer needed since we are dynamically finding the channel
// const config = require('../config.json'); 
const canvacord = require("canvacord");

// Helper function to add ordinal suffix (st, nd, rd, th)
function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        // Dynamic Channel Search:
        // 1. Try to find a channel named "welcome" (case-insensitive)
        let channel = member.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'welcome' && ch.isTextBased());

        // 2. Fallback: If no specific welcome channel, try the server's default "System Channel"
        if (!channel) {
            channel = member.guild.systemChannel;
        }

        // 3. Safety Check: If neither exists, stop execution to prevent crashing
        if (!channel) return;

        const memberCount = member.guild.memberCount;

        // Setup welcome card
        const card = new canvacord.Welcomer()
            .setUsername(member.user.username)
            // Canvacord requires a discriminator, even if it's '0' for new usernames
            .setDiscriminator(member.user.discriminator === '0' ? '' : member.user.discriminator)
            .setMemberCount(`Member #${getOrdinal(memberCount)}`)
            .setGuildName(member.guild.name)
            .setAvatar(member.user.displayAvatarURL({ extension: 'png', forceStatic: true }))
            .setColor("title", "#ffffff")
            .setColor("username-box", "#ffffff")
            .setColor("discriminator-box", "#ffffff")
            .setColor("message-box", "#ffffff")
            .setColor("border", "#000000")
            .setColor("avatar", "#000000")
            // Placeholder background - replace with actual URL later
            .setBackground("https://images.unsplash.com/photo-1533134486753-c833f0ed4866?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80");

        // Build the card
        const cardBuffer = await card.build();
        const attachment = new AttachmentBuilder(cardBuffer, { name: `welcome-${member.id}.png` });

        // Send the message with attachment
        channel.send({ content: `Welcome to **${member.guild.name}**, ${member}!`, files: [attachment] });
    },
};
