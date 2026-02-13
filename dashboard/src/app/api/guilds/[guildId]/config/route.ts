import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import GuildConfig from "@/models/GuildConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { hasManageServer, getUserGuilds } from "@/lib/discord";

export async function GET(
    req: NextRequest,
    { params }: { params: { guildId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Security Check: Does user have access to this guild?
    const guilds = await getUserGuilds(session.accessToken as string);
    const guild = guilds.find((g: any) => g.id === params.guildId);

    if (!guild || !hasManageServer(guild.permissions)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    let config = await GuildConfig.findOne({ guildId: params.guildId });

    if (!config) {
        // Create default config if it doesn't exist
        config = await GuildConfig.create({ guildId: params.guildId });
    }

    return NextResponse.json(config);
}

export async function POST(
    req: NextRequest,
    { params }: { params: { guildId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const guilds = await getUserGuilds(session.accessToken as string);
    const guild = guilds.find((g: any) => g.id === params.guildId);

    if (!guild || !hasManageServer(guild.permissions)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    await dbConnect();

    const config = await GuildConfig.findOneAndUpdate(
        { guildId: params.guildId },
        { $set: body },
        { new: true, upsert: true }
    );

    return NextResponse.json(config);
}
