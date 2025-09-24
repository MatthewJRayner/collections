"use client";

import React, { useEffect, useState } from "react";
import { Art } from "@/types/art";
import ArtCard from "@/components/art/ArtCard";
import Link from "next/link";

export default function ArtPage() {
  const [art, setArt] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArt = art.filter((a) => {
    const query = searchQuery.toLowerCase();
    return (
      a.title?.toLowerCase().includes(query) ||
      a.artist?.toLowerCase().includes(query) ||
      a.type?.toLowerCase().includes(query) ||
      a.format?.toLowerCase().includes(query)
    );
  });

  const fetchArt = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/art/")
      .then((response) => response.json())
      .then((data) => {
        setArt(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArt();
  }, []);

  const deleteArt = async (id: number) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    await fetch(`http://127.0.0.1:8000/api/art/${id}/`, {
      method: "DELETE",
    });
    fetchArt();
  };

  
  // Stats
  const totalOwned = art.filter((a) => a.owned).length;
  const totalOwnedValue = art.filter((a) => a.owned).reduce((sum, a) => sum + Number(a.price || 0), 0)
  const totalValue = art.reduce((sum, a) => sum + Number(a.price || 0), 0);
  const avgPrice = art.length > 0 ? Number(totalValue / art.length).toFixed(0) : 0;
  
  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6 ">
        <h1 className="text-3xl font-bold mr-4">Art</h1>
      </div>

      <div className="flex space-x-4 w-full">
        <div className="flex flex-col w-8/10">
          <div className="flex items-center mb-6 gap-2">
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-1/4 bg-neutral rounded shadow"
            />
            <Link
              href="/art/new"
              className="bg-primary text-white px-2 py-0.5 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
            >
              +
            </Link>  
          </div>
          
          <div>
            {loading ? (
              <p>Loading artworks...</p>
            ) : filteredArt.length === 0 ? (
              <p>No artwork found.</p>
            ) : (
              <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                {filteredArt.map((art) => (
                  <ArtCard
                    key={art.id}
                    art={art}
                    onDelete={deleteArt}
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