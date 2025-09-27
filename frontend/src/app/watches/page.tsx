"use client";

import React, { useEffect, useState } from "react";
import { Watch } from "../../types/watch";
import WatchCard from "../../components/watch/WatchCard";
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/watches/`)
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

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/watches/${id}/`, {
      method: "DELETE",
    });
    fetchWatches();
  };

  // Stats
  const totalOwned = watches.filter((w) => w.owned).length;
  const totalOwnedValue = Number(
    watches
      .filter((w) => w.owned)
      .reduce((sum, w) => sum + Number(w.price || 0), 0)
  );
  const totalValue = Number(
    watches.reduce((sum, w) => sum + Number(w.price || 0), 0)
  );
  const avgPrice =
    watches.length > 0 ? Number(totalValue / watches.length).toFixed(0) : 0;

  if (loading) return <p className="p-6 font-sans text-gray-400">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 flex flex-col w-full min-h-screen">
      <div className="flex justify-center sm:justify-start items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mr-4">Watches</h1>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:space-x-4 w-full">
        <div className="flex flex-col w-full md:w-8/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full sm:w-1/2 md:w-1/3 bg-neutral rounded shadow"
            />
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Link
                href="/watches/new"
                className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
              >
                +
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredWatches.length > 0 ? (
              filteredWatches.map((watch) => (
                <WatchCard
                  key={watch.id}
                  watch={watch}
                  onDelete={deleteWatch}
                />
              ))
            ) : (
              <p className="font-sans text-gray-400">No watches found.</p>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/10">
          <div className="bg-neutral shadow-lg h-fit rounded mb-6">
            <div className="pt-4 w-full flex justify-start pl-4">
              <span className="font-bold font-sans">Stats</span>
            </div>
            <div className="grid grid-cols-1 mt-4 border-b-2 border-b-background/20">
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">Owned</h3>
                <p className="font-bold text-lg">{totalOwned}</p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">Owned Value</h3>
                <p
                  className={`font-bold flex items-center ${
                    totalOwnedValue > 99999 ? "text-sm" : "text-lg"
                  }`}
                >
                  {totalOwnedValue
                    ? `£${totalOwnedValue.toLocaleString()}`
                    : ""}
                </p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">Total Value</h3>
                <p
                  className={`font-bold flex items-center ${
                    totalValue > 99999 ? "text-sm" : "text-lg"
                  }`}
                >
                  {totalValue ? `£${totalValue.toLocaleString()}` : ""}
                </p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">
                  Average Price
                </h3>
                <p
                  className={`font-bold flex items-center ${
                    Number(avgPrice) > 99999 ? "text-sm" : "text-lg"
                  }`}
                >
                  {avgPrice ? `£${Number(avgPrice).toLocaleString()}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
