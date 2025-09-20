"use client";

import React, { useEffect, useState } from "react";
import { Clothing } from "@/types/clothing";
import ClothesCard from "@/components/wardrobe/ClothesCard";
import { formatPhrase } from "@/utils/formatters";
import Link from "next/link";

export default function ClothesPage() {
    const [clothes, setClothes] = useState<Clothing[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClothes = clothes.filter((c) => {
        const query = searchQuery.toLowerCase();
        return (
            c.brands?.toLowerCase().includes(query) ||
            c.style?.toLowerCase().includes(query) ||
            c.type?.toLowerCase().includes(query) ||
            c.category?.toLowerCase().includes(query)
        );
    });

    const fetchClothes = () => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/api/wardrobe/")
            .then((response) => response.json())
            .then((data) => {
                setClothes(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchClothes();
    }, []);

    const deleteClothing = async (id: number) => {
        if (!confirm("Are you sure you want to delete this clothing item")) return;

        await fetch(`http://127.0.0.1:8000/api/wardrobe/${id}/`, {
            method: "DELETE",
        });
        fetchClothes();
    };

    const groupByCategory = React.useMemo(
        () =>
            filteredClothes.reduce<Record<string, Clothing[]>>((acc, item) => {
                const cat = item.category || "Unknown";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
            }, {}),
        [filteredClothes]
    );

    const groupByType = filteredClothes.reduce<Record<string, Clothing[]>>((acc, item) => {
        const type = item.type || "Unknown";
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
    }, {});

    // Stats
    const totalOwned = clothes.filter((c) => c.owned).length;
    const totalOwnedValue = clothes.filter((c) => c.owned).reduce((sum, c) => sum + Number(c.price || 0), 0);
    const totalValue = clothes.reduce((sum, c) => sum + Number(c.price || 0), 0);
    const avgPrice = clothes.length > 0 ? Number(totalValue / clothes.length).toFixed(0) : 0;

    return (
        <div className="p-6">
            <div className="flex justify-start items-center mb-6 ">
                <h1 className="text-3xl font-bold">Wardrobe</h1>
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
                    href="/wardrobe/new"
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
                <div className="rounded p-4 text-center">
                    <h3 className="text-sm">Total Owned Value</h3>
                    <p className="font-bold text-xl mt-2">{totalOwnedValue}</p>
                </div>
            </div>

            {loading ? (
                <p>Loading wardrobe...</p>
            ) : filteredClothes.length === 0 ? (
                <p>No wardrobe items found.</p>
            ) : (
                <div className="space-y-4">
                    {Object.entries(groupByCategory).map(([cat, items]) => (
                        <div key={cat}>
                            <button
                                onClick={() =>
                                    setOpenCategories((prev) => ({
                                        ...prev,
                                        [cat]: !prev[cat],
                                    }))
                                }
                                className="w-full cursor-pointer flex justify-between items-center transition"
                            >
                                <span className={`font-semibold transition ${openCategories[cat] ? "text-primary" : ""}`}>{formatPhrase(cat)}</span>
                                <span className={`transition duration-400 ${openCategories[cat] ? "text-primary transform rotate-180" : ""}`}>▼</span>
                            </button>
                            {openCategories[cat] && (
                                <div className="ml-4">
                                    {Object.entries(groupByType).map(([type]) => (
                                        <div key={type} className="flex flex-col l-4 space-y-6">
                                            <h3 className="text-lf font-semibold mb-2">{type}</h3>
                                            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
                                                {items.map((item) => (
                                                    <ClothesCard
                                                        key={item.id}
                                                        clothing={item}
                                                        onDelete={deleteClothing}
                                                    />
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}