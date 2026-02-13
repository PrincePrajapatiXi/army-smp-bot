"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function WelcomerPage({ params }: { params: { guildId: string } }) {
    const { data: session } = useSession();
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (session) {
            fetch(`/api/guilds/${params.guildId}/config`)
                .then((res) => res.json())
                .then((data) => {
                    setConfig(data);
                    setLoading(false);
                });
        }
    }, [session, params.guildId]);

    const handleSave = async () => {
        setSaving(true);
        await fetch(`/api/guilds/${params.guildId}/config`, {
            method: "POST",
            body: JSON.stringify({
                welcome: config.welcome
            }),
        });
        setSaving(false);
        toast.success("Settings saved successfully!");
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcomer Settings</h1>

            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4 bg-[#111] p-4 rounded-xl border border-[#222]">
                    <input
                        type="checkbox"
                        checked={config?.welcome?.enabled || false}
                        onChange={(e) => setConfig({
                            ...config,
                            welcome: { ...config.welcome, enabled: e.target.checked }
                        })}
                        className="w-6 h-6"
                    />
                    <div>
                        <h3 className="font-bold">Enable Welcomer</h3>
                        <p className="text-gray-400 text-sm">Send a welcome card when a user joins.</p>
                    </div>
                </div>

                <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                    <label className="block text-sm font-medium mb-2">Welcome Message</label>
                    <textarea
                        value={config?.welcome?.message || ""}
                        onChange={(e) => setConfig({
                            ...config,
                            welcome: { ...config.welcome, message: e.target.value }
                        })}
                        className="w-full bg-black border border-[#333] rounded-lg p-3 text-white h-24"
                    />
                    <p className="text-xs text-gray-500 mt-2">Variables: {`{user}`}, {`{server}`}, {`{count}`}</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-white transition-colors"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
