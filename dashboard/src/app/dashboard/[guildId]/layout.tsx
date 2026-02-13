import Sidebar from "@/components/Sidebar";
import { getBotGuild } from "@/lib/discord";

export default async function DashboardLayout(props: {
    children: React.ReactNode;
    params: Promise<{ guildId: string }>;
}) {
    const params = await props.params;
    const { children } = props;

    // Fetch guild details (server-side)
    const guild = await getBotGuild(params.guildId);

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white">
            <Sidebar guildId={params.guildId} guild={guild} />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
