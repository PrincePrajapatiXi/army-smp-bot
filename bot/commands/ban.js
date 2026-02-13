const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for banning'))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Number of days of messages to delete (0-7)')
                .setMinValue(0)
                .setMaxValue(7))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const days = interaction.options.getInteger('days') || 0;

        if (!user) {
            return interaction.reply({ content: '❌ User not found.', ephemeral: true });
        }

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot ban yourself!', ephemeral: true });
        }

        if (user.id === interaction.client.user.id) {
            return interaction.reply({ content: '❌ I cannot ban myself!', ephemeral: true });
        }

        if (target && !target.bannable) {
            return interaction.reply({ content: '❌ I cannot ban this user. They may have a higher role than me.', ephemeral: true });
        }

        try {
            await interaction.guild.members.ban(user, {
                deleteMessageSeconds: days * 86400,
                reason: reason
            });

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🔨 Member Banned')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Reason', value: reason },
                    { name: 'Messages Deleted', value: `${days} day(s)`, inline: true }
                )
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Ban error:', error);
            await interaction.reply({ content: '❌ Failed to ban the user.', ephemeral: true });
        }
    },
};
