"use client";

import React, { useEffect, useState } from "react";
import { Music } from "../../types/music";
import MusicCard from "../../components/music/MusicCard";
import Link from "next/link";

export default function MusicPage() {
    const [music, setMusic] = useState<Music[]>([]);
    const [loading, setLoading] = useState(true);
    const [openLanguages, setOpenLanguages] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMusic = music.filter((m) => {
        const query = searchQuery.toLowerCase();
        return (
            m.title?.toLowerCase().includes(query) ||
            m.artist?.toLowerCase().includes(query) ||
            m.genre?.some((g) => g.toLowerCase().includes(query))
        );
    });

    const fetchMusic = () => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/api/music/")
            .then((response) => response.json())
            .then((data) => {
                setMusic(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMusic();
    }, []);

    const deleteMusic = async (id: number) => {
        if (!confirm("Are you sure you want to delete this music item")) return;

        await fetch(`http://127.0.0.1:8000/api/music/${id}/`, {
            method: "DELETE",
        });
        fetchMusic();
    };

    const groupByLanguage = filteredMusic.reduce<Record<string, Music[]>>((acc, item) => {
        const lang = item.language || "Unknown";
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push(item);
        return acc;
    }, {});

    // Stats
    const totalOwned = music.filter((m) => m.owned).length;
    const totalValue = music.reduce((sum, m) => sum + Number(m.price || 0), 0);
    const avgPrice = music.length > 0 ? Number(totalValue / music.length).toFixed(0) : 0;

    return (
        <div className="p-6">
            <div className="flex justify-start items-center mb-6 ">
                <h1 className="text-3xl font-bold">Music Collection</h1>
            </div>

            <div className="flex items-center mb-6 gap-2">
                <input 
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 w-1/4 bg-neutral rounded shadow"
                />
                <Link
                    href="/music/new"
                    className="bg-primary text-white px-2 py-0.5 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
                >
                    +
                </Link>                
            </div>

            <div className="flex gap-4 mb-6">
                <div className="rounded p-4 text-center">
                <h3 className="text-sm">Total Owned</h3>
                <p className="font-bold text-xl mt-2">{totalOwned}</p>
                </div>
                <div className="rounded p-4 text-center">
                <h3 className="text-sm">Total Value</h3>
                <p className="font-bold text-xl mt-2">£{totalValue.toLocaleString()}</p>
                </div>
                <div className="rounded p-4 text-center">
                <h3 className="text-sm">Average Price</h3>
                <p className="font-bold text-xl mt-2">£{avgPrice.toLocaleString()}</p>
                </div>
            </div>

            {loading ? (
                <p>Loading watches...</p>
            ) : filteredMusic.length === 0 ? (
                <p>No music items found.</p>
            ) : (
                <div className="space-y-4">
                    {Object.entries(groupByLanguage).map(([lang, items]) => (
                        <div key={lang} className="rounded">
                            <button
                                onClick={() =>
                                    setOpenLanguages((prev) => ({
                                        ...prev,
                                        [lang]: !prev[lang],
                                    }))
                                }
                                className="w-full cursor-pointer flex justify-between items-center p-3 transition"
                            >
                                <span className={`font-semibold transition ${openLanguages[lang] ? "text-primary" : ""}`}>{lang}</span>
                                <span className={` transition duration-400 ${openLanguages[lang] ? "text-primary transform rotate-180" : ""}`}>▼</span>
                            </button>
                            {openLanguages[lang] && (
                                <ul className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
                                    {items.map((item) => (
                                        <MusicCard
                                            key={item.id}
                                            music={item}
                                            onDelete={deleteMusic}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}