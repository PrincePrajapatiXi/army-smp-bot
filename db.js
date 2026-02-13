const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
    }
};

// Guild Config Schema (Matches Dashboard)
const GuildConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    welcome: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: null },
        message: { type: String, default: "Welcome {user} to {server}!" },
        background: { type: String, default: null },
    },
    autorole: {
        enabled: { type: Boolean, default: false },
        roleId: { type: String, default: null },
    },
    borderwall: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: null },
    },
}, { timestamps: true });

const GuildConfig = mongoose.models.GuildConfig || mongoose.model('GuildConfig', GuildConfigSchema);

module.exports = { connectDB, GuildConfig };
