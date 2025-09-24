"use client";

import React, { useEffect, useState } from "react";
import { Watch } from "../../types/watch";
import WatchCard from "../../components/watch/WatchCard"
import Link from "next/link";

export default function WatchesPage() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWatches = watches.filter((w) => {
    const query = searchQuery.toLowerCase();
    return (
      w.brand.toLowerCase().includes(query) ||
      w.collection?.toLowerCase().includes(query) ||
      w.model.toLowerCase().includes(query)
    );
  });

  const fetchWatches = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/watches/")
      .then((response) => response.json())
      .then((data) => {
        setWatches(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWatches();
  }, []);

  const deleteWatch = async (id: number) => {
    if (!confirm("Are you sure you want to delete this watch?")) return;

    await fetch(`http://127.0.0.1:8000/api/watches/${id}/`, {
      method: "DELETE",
    });
    fetchWatches();
  };

  
  // Stats
  const totalOwned = watches.filter((w) => w.owned).length;
  const totalOwnedValue = Number(watches.filter((w) => w.owned).reduce((sum, w) => sum + Number(w.price || 0), 0));
  const totalValue = Number(watches.reduce((sum, w) => sum + Number(w.price || 0), 0));
  const avgPrice = watches.length > 0 ? Number(totalValue / watches.length).toFixed(0) : 0;
  
  return (
    <div className="p-6 flex flex-col w-full">

      <div className="flex justify-start items-center mb-6 ">
        <h1 className="text-3xl font-bold mr-4">Watches</h1>
      </div>

      <div className="flex w-full space-x-4">
        <div className="flex flex-col w-8/10">
          <div className="flex items-center mb-6 gap-2 w-full">
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-1/4 bg-neutral rounded shadow"
            />
            <Link
              href="/watches/new"
              className="bg-primary text-white px-2 py-0.5 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
            >
              +
            </Link>  
          </div>
          <div className="w-full">
            {loading ? (
              <p>Loading watches...</p>
            ) : filteredWatches.length === 0 ? (
              <p>No watches found.</p>
            ) : (
              <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {filteredWatches.map((watch) => (
                  <WatchCard
                    key={watch.id}
                    watch={watch}
                    onDelete={deleteWatch}
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