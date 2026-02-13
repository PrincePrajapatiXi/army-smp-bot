"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
            <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 text-center max-w-md">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <AlertTriangle size={24} />
                </div>
                <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
                <p className="text-gray-400 text-sm mb-6">{error.message || "An unexpected error occurred."}</p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
