"use client";

import React, { useEffect, useState } from "react";
import { Instrument } from "@/types/instrument";
import InstrumentCard from "@/components/instruments/InstrumentCard";
import Link from "next/link";

export default function InstrumentsPage() {
    const [instruments, setInstrument] = useState<Instrument[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredInstruments = instruments.filter((i) => {
        const query = searchQuery.toLowerCase();
        return (
            i.brand?.toLowerCase().includes(query) ||
            i.name?.toLowerCase().includes(query) ||
            i.category?.toLowerCase().includes(query) ||
            i.type?.toLowerCase().includes(query)
        );
    });

    const fetchInstruments = () => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/api/instruments/")
            .then((response) => response.json())
            .then((data) => {
                setInstrument(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchInstruments();
    }, []);

    const deleteInstrument = async (id: number) => {
        if (!confirm("Are you sure you want to delete this instrument")) return;

        await fetch(`http://127.0.0.1:8000/api/instrument/${id}/`, {
            method: "DELETE",
        });
        fetchInstruments();
    };

    // Stats
    const totalOwned = instruments.filter((i) => i.owned).length;
    const totalOwnedValue = Number(instruments.filter((i) => i.owned).reduce((sum, i) => sum + Number(i.price || 0), 0));
    const totalValue = instruments.reduce((sum, i) => sum + Number(i.price || 0), 0);
    const avgPrice = instruments.length > 0 ? Number(totalValue / instruments.length).toFixed(0) : 0;

    return (
        <div className="p-6">
            <div className="flex justify-start items-center mb-6 ">
            <h1 className="text-3xl font-bold mr-4">Instruments</h1>
            </div>

            <div className="flex space-x-4">
                <div className="flex flex-col w-8/10">
                    <div className="flex items-center mb-6 gap-2 w-full">
                        <input 
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 bg-neutral rounded shadow"
                        />
                        <Link
                            href="/instruments/new"
                            className="bg-primary text-white px-2 py-0.5 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
                        >
                            +
                        </Link>  
                    </div>

                    <div>
                        {loading ? (
                            <p>Loading instruments...</p>
                        ) : filteredInstruments.length === 0 ? (
                            <p>No instruments found.</p>
                        ) : (
                            <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                {filteredInstruments.map((instrument) => (
                                <InstrumentCard
                                    key={instrument.id}
                                    instrument={instrument}
                                    onDelete={deleteInstrument}
                                />
                                ))}
                            </ul>
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
                            <h3 className="text-sm font-source font-light">Owned</h3>
                            <p className="font-bold text-xl">{totalOwned}</p>
                        </div>
                        <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                            <h3 className="text-sm font-source font-light">Owned Value</h3>
                            <p className={`font-bold flex items-center ${totalOwnedValue > 5 ? "text-md" : "text-lg"}`}>{totalOwnedValue ? `£${totalOwnedValue.toLocaleString()}` : ""}</p>
                        </div>
                        <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                            <h3 className="text-sm font-source font-light">Total Value</h3>
                            <p className={`font-bold flex items-center ${totalValue > 5 ? "text-md" : "text-lg"}`}>{totalValue ? `£${totalValue.toLocaleString()}` : ""}</p>
                        </div>
                        <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                            <h3 className="text-sm font-source font-light">Average Price</h3>
                            <p className={`font-bold flex items-center ${Number(avgPrice) > 5 ? "text-md" : "text-lg"}`}>{avgPrice ? `£${Number(avgPrice).toLocaleString()}` : ""}</p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
}