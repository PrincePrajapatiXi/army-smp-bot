import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserGuilds, hasManageServer, DiscordGuild } from "@/lib/discord";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardSelectionPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    let guilds: DiscordGuild[] = [];
    try {
        guilds = await getUserGuilds(session.accessToken as string);
    } catch (err) {
        console.error(err);
        // If token expired or generic error, generic handling
    }

    // Filter: User must have Manage Server (0x20) or be Owner
    const manageableGuilds = guilds.filter((g) => hasManageServer(g.permissions));

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Select a Server</h1>
                <p className="text-gray-400 mb-8">Choose a server to manage with Army SMP Bot</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {manageableGuilds.map((guild) => (
                        <Link
                            key={guild.id}
                            href={`/dashboard/${guild.id}`}
                            className="group bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col items-center hover:border-indigo-500 transition-all hover:scale-[1.02]"
                        >
                            <div className="w-20 h-20 rounded-full bg-gray-800 mb-4 overflow-hidden relative">
                                {guild.icon ? (
                                    <Image
                                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                                        alt={guild.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                                        {guild.name.substring(0, 2)}
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-center group-hover:text-indigo-400 transition-colors">{guild.name}</h3>
                            <span className="text-xs text-gray-500 mt-1">Administrator</span>
                        </Link>
                    ))}

                    {manageableGuilds.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No servers found where you have "Manage Server" permissions.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
