const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Simple JSON file storage for welcome configs
const CONFIG_FILE = path.join(__dirname, '..', 'data', 'welcomeConfig.json');

function ensureDataDir() {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(CONFIG_FILE)) fs.writeFileSync(CONFIG_FILE, '{}');
}

function getWelcomeConfig(guildId) {
    ensureDataDir();
    const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    return data[guildId] || {};
}

function setWelcomeConfig(guildId, config) {
    ensureDataDir();
    const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    data[guildId] = { ...data[guildId], ...config };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Customize the welcome card')
        .addSubcommand(sub =>
            sub.setName('background')
                .setDescription('Set a custom background image')
                .addAttachmentOption(option =>
                    option.setName('image')
                        .setDescription('Upload an image (recommended 1024x450)')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('reset')
                .setDescription('Reset background to default gradient'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        if (subcommand === 'background') {
            const image = interaction.options.getAttachment('image');

            if (!image.contentType || !image.contentType.startsWith('image/')) {
                return interaction.reply({ content: '❌ Please upload a valid image file.', ephemeral: true });
            }

            setWelcomeConfig(guildId, { background: image.url });

            const embed = new EmbedBuilder()
                .setColor(0x2ECC71)
                .setTitle('✅ Welcome Background Updated')
                .setDescription('The welcome card background has been updated!')
                .setImage(image.url)
                .setFooter({ text: 'Tip: Verify by waiting for a new member or using /testwelcome (coming soon)' });

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'reset') {
            setWelcomeConfig(guildId, { background: null });

            const embed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('↺ Welcome Background Reset')
                .setDescription('Restored the default gradient background.');

            await interaction.reply({ embeds: [embed] });
        }
    },
};
