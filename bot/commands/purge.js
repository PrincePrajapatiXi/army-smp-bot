const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete multiple messages at once')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Only delete messages from this user'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const targetUser = interaction.options.getUser('user');

        await interaction.deferReply({ ephemeral: true });

        try {
            let messages = await interaction.channel.messages.fetch({ limit: amount });

            if (targetUser) {
                messages = messages.filter(msg => msg.author.id === targetUser.id);
            }

            // Filter out messages older than 14 days (Discord limit)
            const now = Date.now();
            messages = messages.filter(msg => (now - msg.createdTimestamp) < 14 * 24 * 60 * 60 * 1000);

            const deleted = await interaction.channel.bulkDelete(messages, true);

            const embed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setTitle('🗑️ Messages Purged')
                .addFields(
                    { name: 'Deleted', value: `${deleted.size} message(s)`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp();

            if (targetUser) {
                embed.addFields({ name: 'Filtered By', value: targetUser.tag, inline: true });
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Purge error:', error);
            await interaction.editReply({ content: '❌ Failed to delete messages. Messages older than 14 days cannot be bulk deleted.' });
        }
    },
};
