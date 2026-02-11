const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badge')
        .setDescription('Active Developer Badge command'),
    async execute(interaction) {
        await interaction.reply('Mubarak ho! Command chal gayi.');
    },
};
