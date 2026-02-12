const { AttachmentBuilder, ChannelType } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('node:fs');
const path = require('node:path');

const CONFIG_FILE = path.join(__dirname, '..', 'data', 'welcomeConfig.json');

function getWelcomeConfig(guildId) {
    if (!fs.existsSync(CONFIG_FILE)) return {};
    try {
        const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        return data[guildId] || {};
    } catch (e) {
        return {};
    }
}

// --- CONFIGURATION ---
const MAIN_SERVER_ID = '804539841932689438';
const SERVER_IP = 'play.armysmp.fun';
const SERVER_PORT = '25567';

// Helper function to add ordinal suffix (st, nd, rd, th)
function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            console.log(`🚀 EVENT TRIGGERED: New member ${member.user.tag} joined ${member.guild.name}`);

            // --- SMART CHANNEL DETECTION ---
            // Priority: #welcome > systemChannel > #general
            let channel = member.guild.channels.cache.find(ch =>
                ch.name.normalize('NFKD').toLowerCase().includes('welcome') &&
                ch.type === ChannelType.GuildText
            );

            if (!channel) {
                channel = member.guild.systemChannel;
            }

            if (!channel) {
                channel = member.guild.channels.cache.find(ch =>
                    ch.name.toLowerCase() === 'general' &&
                    ch.type === ChannelType.GuildText
                );
            }

            if (!channel) {
                console.log(`❌ NO CHANNEL FOUND in ${member.guild.name} — skipping`);
                return;
            }

            console.log(`✅ FOUND CHANNEL: ${channel.name} (${channel.id})`);

            // Check if this is the main Army SMP server
            const isMainServer = member.guild.id === MAIN_SERVER_ID;
            const memberCount = member.guild.memberCount;

            // --- BUILD WELCOME CARD WITH CANVAS ---
            const width = 1024;
            const height = 450;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            // Background or Gradient
            const config = getWelcomeConfig(member.guild.id);
            let backgroundLoaded = false;

            if (config.background) {
                try {
                    const bgImage = await loadImage(config.background);
                    // Draw user image scaling to cover the canvas (cover mode)
                    const hRatio = canvas.width / bgImage.width;
                    const vRatio = canvas.height / bgImage.height;
                    const ratio = Math.max(hRatio, vRatio);
                    const centerShift_x = (canvas.width - bgImage.width * ratio) / 2;
                    const centerShift_y = (canvas.height - bgImage.height * ratio) / 2;

                    ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height,
                        centerShift_x, centerShift_y, bgImage.width * ratio, bgImage.height * ratio);

                    // Add dark overlay for text readability
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                    ctx.fillRect(0, 0, width, height);

                    backgroundLoaded = true;
                } catch (err) {
                    console.error('Failed to load custom background:', err);
                }
            }

            if (!backgroundLoaded) {
                // Fallback Gradient (dark theme)
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, '#0f0c29');
                gradient.addColorStop(0.5, '#302b63');
                gradient.addColorStop(1, '#24243e');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }

            // Decorative top and bottom bars
            const barGradient = ctx.createLinearGradient(0, 0, width, 0);
            barGradient.addColorStop(0, '#667eea');
            barGradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = barGradient;
            ctx.fillRect(0, 0, width, 8);
            ctx.fillRect(0, height - 8, width, 8);

            // Semi-transparent card background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            roundRect(ctx, 40, 40, width - 80, height - 80, 20);
            ctx.fill();

            // Border for inner card
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            roundRect(ctx, 40, 40, width - 80, height - 80, 20);
            ctx.stroke();

            // Avatar
            const avatarURL = member.user.displayAvatarURL({ extension: 'png', forceStatic: true, size: 256 });
            const avatar = await loadImage(avatarURL);

            const avatarX = 160;
            const avatarY = height / 2;
            const avatarRadius = 90;

            // Avatar glow effect
            ctx.shadowColor = '#667eea';
            ctx.shadowBlur = 30;
            ctx.beginPath();
            ctx.arc(avatarX, avatarY, avatarRadius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Clip and draw avatar
            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
            ctx.restore();

            // Text section
            const textX = 300;

            // "WELCOME" label
            ctx.fillStyle = '#667eea';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.fillText('W E L C O M E', textX, 130);

            // Username
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 42px Arial, sans-serif';
            const username = member.user.username.length > 18
                ? member.user.username.substring(0, 18) + '...'
                : member.user.username;
            ctx.fillText(username, textX, 190);

            // Server name
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '22px Arial, sans-serif';
            ctx.fillText(`to ${member.guild.name}`, textX, 230);

            // Divider line
            const dividerGradient = ctx.createLinearGradient(textX, 0, textX + 400, 0);
            dividerGradient.addColorStop(0, '#667eea');
            dividerGradient.addColorStop(1, 'transparent');
            ctx.strokeStyle = dividerGradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(textX, 255);
            ctx.lineTo(textX + 400, 255);
            ctx.stroke();

            // --- DYNAMIC SECTION: Different for Main Server vs Others ---
            if (isMainServer) {
                // ARMY SMP: Show Server IP & Port
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 28px Arial, sans-serif';
                ctx.fillText(`IP: ${SERVER_IP}`, textX, 300);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.font = 'bold 22px Arial, sans-serif';
                ctx.fillText(`Port: ${SERVER_PORT}`, textX, 340);
            } else {
                // OTHER SERVERS: Show Member Count
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 28px Arial, sans-serif';
                ctx.fillText(`Member #${getOrdinal(memberCount)}`, textX, 300);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.font = '18px Arial, sans-serif';
                ctx.fillText('Enjoy your stay and have fun! 🎉', textX, 340);
            }

            // Convert canvas to buffer and send
            const buffer = canvas.toBuffer('image/png');
            const attachment = new AttachmentBuilder(buffer, { name: `welcome-${member.id}.png` });

            await channel.send({
                content: `Welcome to **${member.guild.name}**, ${member}!`,
                files: [attachment]
            });
            console.log(`✅ WELCOME SENT for ${member.user.tag} in ${member.guild.name}`);

        } catch (error) {
            console.error(`❌ WELCOME ERROR for ${member.user?.tag}:`, error);
        }
    },
};

// Helper: Draw rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
