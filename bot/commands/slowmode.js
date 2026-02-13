const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slowmode for the current channel')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('Slowmode duration in seconds (0 to disable)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)) // max 6 hours
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');

        try {
            await interaction.channel.setRateLimitPerUser(seconds);

            let durationText;
            if (seconds === 0) {
                durationText = 'Disabled';
            } else if (seconds >= 3600) {
                durationText = `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
            } else if (seconds >= 60) {
                durationText = `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
            } else {
                durationText = `${seconds}s`;
            }

            const embed = new EmbedBuilder()
                .setColor(seconds === 0 ? 0x2ECC71 : 0xE67E22)
                .setTitle(seconds === 0 ? '🟢 Slowmode Disabled' : '🐌 Slowmode Set')
                .addFields(
                    { name: 'Channel', value: `#${interaction.channel.name}`, inline: true },
                    { name: 'Duration', value: durationText, inline: true },
                    { name: 'Set By', value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Slowmode error:', error);
            await interaction.reply({ content: '❌ Failed to set slowmode.', ephemeral: true });
        }
    },
};
