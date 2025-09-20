"use client";

import React, { useEffect, useState } from "react";
import { FilmPhysical } from "@/types/filmMedia";
import FilmMediaCard from "@/components/film/FilmMediaCard";
import Link from "next/link";

export default function FilmMediaPage() {
  const [filmMedia, setFilmMedia] = useState<FilmPhysical[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWFilmMedia = filmMedia.filter((f) => {
    const query = searchQuery.toLowerCase();
    return (
      f.title.toLowerCase().includes(query) ||
      f.director?.toLowerCase().includes(query) ||
      f.format.toString().toLowerCase().includes(query)
    );
  });

  const fetchFilmMedia = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/film-collections/")
      .then((response) => response.json())
      .then((data) => {
        setFilmMedia(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFilmMedia();
  }, []);

  const deleteFilmMedia = async (id: number) => {
    if (!confirm("Are you sure you want to delete this film?")) return;

    await fetch(`http://127.0.0.1:8000/api/film-collections/${id}/`, {
      method: "DELETE",
    });
    fetchFilmMedia();
  };

  
  // Stats
  const totalOwned = filmMedia.filter((f) => f.owned).length;
  const totalOwnedValue = filmMedia.filter((f) => f.owned).reduce((sum, f) => sum + Number(f.price || 0), 0);
  const totalValue = filmMedia.reduce((sum, f) => sum + Number(f.price || 0), 0);
  const avgPrice = filmMedia.length > 0 ? Number(totalValue / filmMedia.length).toFixed(0) : 0;
  
  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6 ">
        <h1 className="text-3xl font-bold mr-4">Film Collection</h1>
      </div>

      <div className="flex items-center mb-6 gap-2">
        <input 
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 w-1/4 bg-neutral rounded shadow"
        />
        <Link
          href="/films/collections/new"
          className="bg-primary text-white px-2 py-0.5 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
        >
          +
        </Link>
        <Link
            href="/films"
            className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
        >
            {`Films `}
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
        <p>Loading film collection...</p>
      ) : filteredWFilmMedia.length === 0 ? (
        <p>No films found.</p>
      ) : (
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredWFilmMedia.map((filmMedia) => (
            <FilmMediaCard
              key={filmMedia.id}
              filmMedia={filmMedia}
              onDelete={deleteFilmMedia}
            />
          ))}
        </ul>
      )}
    </div>
  );
}