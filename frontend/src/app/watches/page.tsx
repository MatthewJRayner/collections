"use client";

import React, { useEffect, useState } from "react";
import { Watch } from "../../types/watch";
import WatchCard from "../../components/watch/WatchCard"
import Link from "next/link";

export default function WatchesPage() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);

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
  const totalValue = watches.reduce((sum, w) => sum + Number(w.price || 0), 0);
  const avgPrice = watches.length > 0 ? Number(totalValue / watches.length).toFixed(0) : 0;
  
  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6 ">
        <h1 className="text-3xl font-bold mr-4">Watches</h1>
        <Link
          href="/watches/new"
          className="bg-primary text-background px-2 py-0.5 hover:bg-neutral-mid hover:scale-105 transition rounded-md"
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
      ) : watches.length === 0 ? (
        <p>No watches found.</p>
      ) : (
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {watches.map((watch) => (
            <WatchCard
              key={watch.id}
              watch={watch}
              onDelete={deleteWatch}
            />
          ))}
        </ul>
      )}
    </div>
  );
}