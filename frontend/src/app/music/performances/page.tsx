"use client";

import React, { useEffect, useState } from "react";
import { Performance } from "@/types/performance";
import PerformanceCard from "@/components/music/PerformanceCard";
import Link from "next/link";

export default function PerformancePage() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPerformances = performances.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.composer.toLowerCase().includes(query) ||
      p.performance_type.toLowerCase().includes(query) ||
      p.orchestra_ensemble?.toLowerCase().includes(query) ||
      p.original_language?.toLowerCase().includes(query)
    );
  });

  const fetchPerformances = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/performances/`)
      .then((response) => response.json())
      .then((data) => {
        setPerformances(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPerformances();
  }, []);

  const deletePerformance = async (id: number) => {
    if (!confirm("Are you sure you want to delete this performance?")) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/performances/${id}/`, {
      method: "DELETE",
    });
    fetchPerformances();
  };

  // Stats
  const totalSeen = performances.filter((p) => p.seen).length;

  if (loading) return <p className="p-6 font-sans text-gray-400">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 flex flex-col w-full min-h-screen">
      <div className="flex justify-center sm:justify-start items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mr-4">Performances</h1>
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
                href="/music/performances/new"
                className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md text-sm sm:text-base"
              >
                +
              </Link>
              <Link
                href="/music"
                className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md text-sm sm:text-base"
              >
                Performances
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPerformances.length > 0 ? (
              filteredPerformances.map((performance) => (
                <PerformanceCard
                  key={performance.id}
                  performance={performance}
                  onDelete={deletePerformance}
                />
              ))
            ) : (
              <p className="font-sans text-gray-400">No performances found.</p>
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
                <h3 className="text-sm font-source font-light">Seen</h3>
                <p className="font-bold text-lg">{totalSeen}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
