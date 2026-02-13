"use client";

import { useState } from "react";
import { ChevronDown, ChevronsUpDown, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ServerSelectorProps {
    currentGuild?: {
        id: string;
        name: string;
        icon: string | null;
    };
}

export default function ServerSelector({ currentGuild }: ServerSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden relative border border-[#333]">
                        {currentGuild?.icon ? (
                            <Image
                                src={`https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.png`}
                                alt={currentGuild.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="font-bold text-white text-xs">
                                {currentGuild?.name?.substring(0, 2) || "SV"}
                            </span>
                        )}
                    </div>
                    <div className="text-left">
                        <h2 className="font-bold text-white text-xs truncate max-w-[100px]">
                            {currentGuild?.name || "Select Server"}
                        </h2>
                        <p className="text-[10px] text-gray-500 group-hover:text-indigo-400 transition-colors">
                            Change Server
                        </p>
                    </div>
                </div>
                <ChevronsUpDown size={14} className="text-gray-500" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 w-full mt-2 bg-[#181818] border border-[#333] rounded-lg shadow-xl z-50 overflow-hidden py-1"
                        >
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-[#222] hover:text-white transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <ChevronDown size={14} />
                                View All Servers
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
