"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Settings,
    Shield,
    Users,
    BookOpen,
    PartyPopper,
    UserPlus,
    MessageSquare,
    Mic,
    ChevronDown
} from "lucide-react";
import Image from "next/image";

const menuItems = [
    { name: "Bot Customisation", href: "/dashboard/[guildId]/customisation", icon: Settings },
    { name: "Server Overview", href: "/dashboard/[guildId]", icon: BarChart3 },
    { name: "Bot Settings", href: "/dashboard/[guildId]/settings", icon: Settings },
    { name: "Borderwall", href: "/dashboard/[guildId]/borderwall", icon: Shield },
    { name: "Leaver", href: "/dashboard/[guildId]/leaver", icon: Users },
    { name: "Rules", href: "/dashboard/[guildId]/rules", icon: BookOpen },
    { name: "Welcomer", href: "/dashboard/[guildId]/welcomer", icon: PartyPopper },
    { name: "AutoRoles", href: "/dashboard/[guildId]/autoroles", icon: UserPlus },
    { name: "TempChannels", href: "/dashboard/[guildId]/tempchannels", icon: Mic },
];

import ServerSelector from "./ServerSelector";

interface SidebarProps {
    guildId: string;
    guild?: {
        id: string;
        name: string;
        icon: string | null;
    } | null;
}

export default function Sidebar({ guildId, guild }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen bg-[#111111] border-r border-[#222] flex flex-col fixed left-0 top-0">
            {/* Server Header */}
            <div className="p-4 border-b border-[#222]">
                <ServerSelector currentGuild={guild || undefined} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {menuItems.map((item) => {
                    const href = item.href.replace("[guildId]", guildId || "demo");
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={item.name}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive
                                ? "bg-indigo-600/10 text-indigo-400"
                                : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                                }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div className="p-4 border-t border-[#222]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <div className="text-xs">
                        <p className="text-white font-medium">User</p>
                        <p className="text-gray-500">View Profile</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
