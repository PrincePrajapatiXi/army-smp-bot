import mongoose, { Schema, model, models } from "mongoose";

const GuildConfigSchema = new Schema({
    guildId: { type: String, required: true, unique: true },
    welcome: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: null },
        message: { type: String, default: "Welcome {user} to {server}!" },
        background: { type: String, default: null }, // URL to background image
    },
    autorole: {
        enabled: { type: Boolean, default: false },
        roleId: { type: String, default: null },
    },
    borderwall: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: null },
    },
    // Add other modules here as needed
}, { timestamps: true });

const GuildConfig = models.GuildConfig || model("GuildConfig", GuildConfigSchema);

export default GuildConfig;
