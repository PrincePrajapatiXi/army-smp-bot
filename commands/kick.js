const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot kick yourself!', ephemeral: true });
        }

        if (target.id === interaction.client.user.id) {
            return interaction.reply({ content: '❌ I cannot kick myself!', ephemeral: true });
        }

        if (!target.kickable) {
            return interaction.reply({ content: '❌ I cannot kick this user. They may have a higher role than me.', ephemeral: true });
        }

        try {
            await target.kick(reason);

            const embed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('👢 Member Kicked')
                .addFields(
                    { name: 'User', value: `${target.user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setThumbnail(target.user.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Kick error:', error);
            await interaction.reply({ content: '❌ Failed to kick the user.', ephemeral: true });
        }
    },
};
