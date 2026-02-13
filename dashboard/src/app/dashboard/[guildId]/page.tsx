import { getBotGuild } from "@/lib/discord";
import { Users, Hash, ShieldAlert, Zap } from "lucide-react";

export default async function DashboardOverview({ params }: { params: { guildId: string } }) {
    const guild = await getBotGuild(params.guildId);

    if (!guild) return <div>Guild not found</div>;

    const stats = [
        { label: "Total Members", value: "Fetching...", icon: Users, color: "text-blue-400" }, // We can't get member count easily without bot token call
        { label: "Channels", value: "N/A", icon: Hash, color: "text-green-400" },
        { label: "Security Level", value: guild.verification_level || "Unknown", icon: ShieldAlert, color: "text-red-400" },
        { label: "Premium Tier", value: guild.premium_tier || "0", icon: Zap, color: "text-yellow-400" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Server Overview</h1>
                <p className="text-gray-400">Welcome back! Here's what's happening in {guild.name}.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-[#111] p-6 rounded-xl border border-[#222]">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gray-900 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs text-gray-500 font-mono">LIVE</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Mockup */}
            <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <p className="text-sm text-gray-300">
                                <span className="font-bold text-white">Bot</span> updated <span className="text-indigo-400">Welcome Module</span> settings.
                            </p>
                            <span className="ml-auto text-xs text-gray-500">2 mins ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
