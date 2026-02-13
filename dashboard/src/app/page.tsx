"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="z-10 text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="text-indigo-500">Army SMP</span> Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Manage your server, customize welcome cards, and configure your bot — all from one beautiful interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all flex items-center gap-2"
          >
            Login with Discord
          </button>
          <a
            href="https://discord.com/invite/your-server"
            target="_blank"
            className="px-8 py-3 bg-[#222] hover:bg-[#333] text-white rounded-lg font-bold transition-all"
          >
            Support Server
          </a>
        </div>
      </div>
    </div>
  );
}
