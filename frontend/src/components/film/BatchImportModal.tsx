"use client";

import { useState } from "react";
import { formatPhrase } from "@/utils/formatters";

interface ImportResult {
    item: string;
    status: string;
}

export default function BatchImportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ImportResult[]>([]);

    const handleImport = async () => {
        setLoading(true);
        setResults([]);

        const items = input.split("\n").map((line) => line.trim()).filter((line) => line);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/batch-import-films/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
        });

        const data = await response.json();
        setResults(data.results);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 p-4 pt-8 sm:pt-16 overflow-y-auto">
            <div className="bg-background p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg flex flex-col max-h-[90vh]">
                <h2 className="text-lg sm:text-xl font-bold font-sans mb-4">Import Films</h2>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste titles or TMDb IDs here (one per line)"
                    className="w-full h-32 sm:h-40 p-2 border border-neutral/50 rounded mb-4 bg-neutral text-base focus:outline-none focus:ring-2 focus:ring-primary resize-none touch-action-manipulation"
                />
                <div className="flex justify-end gap-2 flex-wrap">
                    <button
                        onClick={onClose}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-neutral-mid text-background hover:bg-danger hover:text-white cursor-pointer transition-all duration-300 text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={loading}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-primary text-white hover:text-background hover:bg-neutral-mid cursor-pointer transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                    >
                        {loading ? "Importing..." : "Import"}
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="mt-4 space-y-2 flex-1 overflow-y-auto">
                        <h3 className="font-semibold text-sm sm:text-base font-sans">Results:</h3>
                        <ul className="text-sm">
                            {results.map((r, i) => (
                                <li key={i} className={r.status === "imported" ? "text-success" : "text-danger"}>
                                    {r.item}: {formatPhrase(r.status)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}