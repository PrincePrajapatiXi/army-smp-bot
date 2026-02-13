import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DISCORD_API_BASE = "https://discord.com/api/v10";

export async function getUserGuilds(accessToken: string) {
    const res = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch guilds");
    }

    return res.json();
}

export async function getBotGuild(guildId: string) {
    const res = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}`, {
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`, // Use Bot Token
        },
    });

    if (!res.ok) return null;
    return res.json();
}

export function hasManageServer(permissions: string | number): boolean {
    // 'Manage Server' permission bit is 0x20 (32)
    const MANAGE_SERVER = 0x20n;
    const perms = BigInt(permissions);
    return (perms & MANAGE_SERVER) === MANAGE_SERVER;
}

export interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    permissions: string;
    features: string[];
}
