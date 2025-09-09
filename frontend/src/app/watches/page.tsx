"use client";

import React, { useEffect, useState } from "react";
import { Watch } from "../../types/watch";
import WatchCard from "../../components/WatchCard"
import Link from "next/link";

export default function WatchesPage() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null);

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
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Watches</h1>
        <Link
          href="/watches/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Watch
        </Link>
      </div>

      {loading ? (
        <p>Loading watches...</p>
      ) : watches.length === 0 ? (
        <p>No watches found.</p>
      ) : (
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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