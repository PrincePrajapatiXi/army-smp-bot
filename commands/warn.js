const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Simple JSON file storage for warnings
const WARNS_FILE = path.join(__dirname, '..', 'data', 'warns.json');

function ensureDataDir() {
    const dir = path.dirname(WARNS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(WARNS_FILE)) fs.writeFileSync(WARNS_FILE, '{}');
}

function getWarnings(guildId, userId) {
    ensureDataDir();
    const data = JSON.parse(fs.readFileSync(WARNS_FILE, 'utf8'));
    const key = `${guildId}_${userId}`;
    return data[key] || [];
}

function setWarnings(guildId, userId, warnings) {
    ensureDataDir();
    const data = JSON.parse(fs.readFileSync(WARNS_FILE, 'utf8'));
    const key = `${guildId}_${userId}`;
    data[key] = warnings;
    fs.writeFileSync(WARNS_FILE, JSON.stringify(data, null, 2));
}

function clearWarnings(guildId, userId) {
    ensureDataDir();
    const data = JSON.parse(fs.readFileSync(WARNS_FILE, 'utf8'));
    const key = `${guildId}_${userId}`;
    delete data[key];
    fs.writeFileSync(WARNS_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member or view warnings')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Warn a member')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The member to warn')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for warning')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('View warnings of a member')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The member to check')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('clear')
                .setDescription('Clear all warnings of a member')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The member to clear warnings for')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        if (subcommand === 'add') {
            const reason = interaction.options.getString('reason');

            const warnings = getWarnings(guildId, user.id);
            warnings.push({
                reason: reason,
                moderator: interaction.user.tag,
                date: new Date().toISOString()
            });
            setWarnings(guildId, user.id, warnings);

            const embed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('⚠️ Member Warned')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Reason', value: reason },
                    { name: 'Total Warnings', value: `${warnings.length}`, inline: true }
                )
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'list') {
            const warnings = getWarnings(guildId, user.id);

            if (warnings.length === 0) {
                return interaction.reply({ content: `✅ ${user.tag} has no warnings.`, ephemeral: true });
            }

            const warnList = warnings.map((w, i) =>
                `**#${i + 1}** — ${w.reason}\n> By ${w.moderator} • ${new Date(w.date).toLocaleDateString()}`
            ).join('\n\n');

            const embed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setTitle(`📋 Warnings for ${user.tag}`)
                .setDescription(warnList)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: `Total: ${warnings.length} warning(s)` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'clear') {
            clearWarnings(guildId, user.id);

            const embed = new EmbedBuilder()
                .setColor(0x2ECC71)
                .setTitle('✅ Warnings Cleared')
                .setDescription(`All warnings have been cleared for **${user.tag}**`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },
};
