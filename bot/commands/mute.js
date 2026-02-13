const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Timeout (mute) a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The member to mute')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration in minutes')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(40320)) // max 28 days
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for muting'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot mute yourself!', ephemeral: true });
        }

        if (!target.moderatable) {
            return interaction.reply({ content: '❌ I cannot mute this user. They may have a higher role than me.', ephemeral: true });
        }

        try {
            const ms = duration * 60 * 1000;
            await target.timeout(ms, reason);

            // Format duration for display
            let durationText;
            if (duration >= 1440) {
                durationText = `${Math.floor(duration / 1440)} day(s)`;
            } else if (duration >= 60) {
                durationText = `${Math.floor(duration / 60)} hour(s)`;
            } else {
                durationText = `${duration} minute(s)`;
            }

            const embed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle('🔇 Member Muted')
                .addFields(
                    { name: 'User', value: `${target.user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Duration', value: durationText, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setThumbnail(target.user.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Mute error:', error);
            await interaction.reply({ content: '❌ Failed to mute the user.', ephemeral: true });
        }
    },
};
