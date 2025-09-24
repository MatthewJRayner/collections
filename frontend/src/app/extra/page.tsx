"use client";

import React, { useEffect, useState } from "react";
import { Extra } from "@/types/extra";
import ExtraCard from "@/components/extra/ExtraCard";
import Link from "next/link";

export default function ExtraPage() {
    const [extra, setExtra] = useState<Extra[]>([]);
    const [loading, setLoading] = useState(true);
    const [openTheme, setOpenTheme] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");

    const filteredExtra = extra.filter((e) => {
        const query = searchQuery.toLowerCase();
        return (
            e.brand?.toLowerCase().includes(query) ||
            e.model?.toLowerCase().includes(query) ||
            e.theme?.toLowerCase().includes(query)
        );
    });

    const fetchExtra = () => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/api/extra/")
            .then((response) => response.json())
            .then((data) => {
                setExtra(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchExtra();
    }, []);

    const deleteExtra = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item")) return;

        await fetch(`http://127.0.0.1:8000/api/extra/${id}/`, {
            method: "DELETE",
        });
        fetchExtra();
    };

    const groupByTheme = filteredExtra.reduce<Record<string, Extra[]>>((acc, item) => {
        const theme = item.theme || "Unknown";
        if (!acc[theme]) acc[theme] = [];
        acc[theme].push(item);
        return acc;
    }, {});

    // Stats
    const totalOwned = extra.filter((e) => e.owned).length;
    const totalOwnedValue = extra.filter((e) => e.owned).reduce((sum, e) => sum + Number(e.price || 0), 0);
    const totalValue = extra.reduce((sum, e) => sum + Number(e.price || 0), 0);
    const avgPrice = extra.length > 0 ? Number(totalValue / extra.length).toFixed(0) : 0;

    return (
        <div className="p-6">
            <div className="flex justify-start items-center mb-6 ">
                <h1 className="text-3xl font-bold">Extra Collections</h1>
            </div>

            <div className="flex space-x-4 w-full">
                <div className="flex flex-col w-8/10">
                    <div className="flex items-center mb-6 gap-2">
                        <input 
                            type='text'
                            placeholder='Search...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 w-1/4 bg-neutral rounded shadow"
                        />
                        <Link
                            href="/extra/new"
                            className="bg-primary text-white px-2 py-0.5 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
                        >
                            +
                        </Link>                
                    </div>

                    <div>
                        {loading ? (
                            <p>Loading collection...</p>
                        ) : filteredExtra.length === 0 ? (
                            <p>No items found.</p>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(groupByTheme).map(([theme, items]) => (
                                    <div key={theme} className="rounded">
                                        <button
                                            onClick={() =>
                                                setOpenTheme((prev) => ({
                                                    ...prev,
                                                    [theme]: !prev[theme],
                                                }))
                                            }
                                            className="w-full cursor-pointer flex justify-between py-3 items-center transition"
                                        >
                                            <span className={`font-semibold transition ${openTheme[theme] ? "text-primary" : ""}`}>{theme}</span>
                                            <span className={` transition duration-400 ${openTheme[theme] ? "text-primary transform rotate-180" : ""}`}>▼</span>
                                        </button>
                                        {openTheme[theme] && (
                                            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
                                                {items.map((item) => (
                                                    <ExtraCard
                                                        key={item.id}
                                                        extra={item}
                                                        onDelete={deleteExtra}
                                                    />
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>   
                <div className="w-2/10">
                    <div className="flex flex-col items-center bg-neutral shadow-lg h-fit rounded">
                        <div className="pt-4 w-full flex justify-start pl-4">
                        <span className="font-bold">Stats</span>
                        </div>
                        <div className="flex flex-col w-full items-center justify-center mb-6 mt-4 border-b-2 border-b-background/20">
                        <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                            <h3 className="text-sm font-source font-medium">Owned</h3>
                            <p className="font-bold text-xl">{totalOwned}</p>
                        </div>
                        <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                            <h3 className="text-sm font-source font-light">Owned Value</h3>
                            <p className={`font-bold flex items-center ${totalOwnedValue > 5 ? "text-md" : "text-lg"}`}>{totalOwnedValue ? `£${totalOwnedValue.toLocaleString()}` : "£0"}</p>
                        </div>
                        <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                            <h3 className="text-sm font-source font-light">Total Value</h3>
                            <p className={`font-bold flex items-center ${totalValue > 5 ? "text-md" : "text-lg"}`}>{totalValue ? `£${totalValue.toLocaleString()}` : "£0"}</p>
                        </div>
                        <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                            <h3 className="text-sm font-source font-light">Average Price</h3>
                            <p className={`font-bold flex items-center ${Number(avgPrice) > 5 ? "text-md" : "text-lg"}`}>{avgPrice ? `£${Number(avgPrice).toLocaleString()}` : "£0"}</p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}