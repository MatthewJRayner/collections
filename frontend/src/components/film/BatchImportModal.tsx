"use client";

import { useState } from "react";
import { formatPhrase } from "@/utils/formatters";

export default function BatchImportModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void}) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const handleImport = async () => {
        setLoading(true)
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">Import Films</h2>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste titles or TMDb IDs here (one per line)"
                    className="w-full h-40 p-2 border rounded mb-4 bg-neutral"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-neutral-mid text-background hover:bg-danger hover:text-white cursor-pointer transition-all duration-300">Cancel</button>
                    <button
                    onClick={handleImport}
                    disabled={loading}
                    className="px-4 py-2 rounded bg-primary text-white hover:text-background hover:bg-neutral-mid cursor-pointer transition-all duration-300"
                    >
                    {loading ? "Importing..." : "Import"}
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="mt-4 space-y-2">
                    <h3 className="font-semibold">Results:</h3>
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