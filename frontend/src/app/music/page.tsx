"use client";

import React, { useEffect, useState } from "react";
import { Music } from "../../types/music";
import MusicCard from "../../components/music/MusicCard";
import Link from "next/link";
import { getLanguageName } from "@/utils/iso";

export default function MusicPage() {
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [openLanguages, setOpenLanguages] = useState<Record<string, boolean>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyOwned, setOnlyOwned] = useState(false);

  const filteredMusic = music.filter((m) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      m.title?.toLowerCase().includes(query) ||
      m.artist?.toLowerCase().includes(query) ||
      m.genre?.some((g) => g.toLowerCase().includes(query));
    const matchesOwnership = !onlyOwned || m.owned;

    return matchesSearch && matchesOwnership;
  });

  const fetchMusic = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/music/`)
      .then((response) => response.json())
      .then((data) => {
        setMusic(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMusic();
  }, []);

  const deleteMusic = async (id: number) => {
    if (!confirm("Are you sure you want to delete this music item")) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/music/${id}/`, {
      method: "DELETE",
    });
    fetchMusic();
  };

  const groupByLanguage = filteredMusic.reduce<Record<string, Music[]>>(
    (acc, item) => {
      const lang = item.language || "Unknown";
      if (!acc[lang]) acc[lang] = [];
      acc[lang].push(item);
      return acc;
    },
    {}
  );

  // Stats
  const totalOwned = music.filter((m) => m.owned).length;
  const totalOwnedValue = music
    .filter((m) => m.owned)
    .reduce((sum, m) => sum + Number(m.price || 0), 0);
  const totalValue = music.reduce((sum, m) => sum + Number(m.price || 0), 0);
  const avgPrice =
    music.length > 0 ? Number(totalValue / music.length).toFixed(0) : 0;

  return (
    <div className="p-4 sm:p-6 w-full flex flex-col min-h-screen">
      <div className="flex justify-center sm:justify-start items-center mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Music Collection</h1>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:space-x-4 w-full">
        <div className="flex flex-col w-full md:w-8/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full sm:w-1/2 md:w-1/3 mt-2 sm:mt-0 bg-neutral rounded shadow"
            />
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Link
                href="/music/new"
                className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md text-sm sm:text-base"
              >
                +
              </Link>
            </div>
            <button
              onClick={() => setOnlyOwned((prev) => !prev)}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 cursor-pointer ${
                onlyOwned
                  ? "bg-primary text-white"
                  : "bg-neutral hover:opacity-80"
              }`}
            >
              {onlyOwned ? "Owned Only" : "Show All"}
            </button>
          </div>

          <div className="">
            {loading ? (
              <p>Loading music...</p>
            ) : filteredMusic.length === 0 ? (
              <p>No music items found.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupByLanguage).map(([lang, items]) => (
                  <div key={lang} className="rounded">
                    <button
                      onClick={() =>
                        setOpenLanguages((prev) => ({
                          ...prev,
                          [lang]: !prev[lang],
                        }))
                      }
                      className="w-full cursor-pointer flex justify-between items-center p-3 transition"
                    >
                      <span
                        className={`font-semibold transition ${
                          openLanguages[lang] ? "text-primary" : ""
                        }`}
                      >
                        {getLanguageName(lang)}
                      </span>
                      <span
                        className={` transition duration-400 ${
                          openLanguages[lang]
                            ? "text-primary transform rotate-180"
                            : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    {openLanguages[lang] && (
                      <ul className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {items.map((item) => (
                          <MusicCard
                            key={item.id}
                            music={item}
                            onDelete={deleteMusic}
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
        <div className="w-full md:w-2/10">
          <div className="bg-neutral shadow-lg h-fit rounded">
            <div className="pt-4 w-full flex justify-start pl-4">
              <span className="font-bold">Stats</span>
            </div>
            <div className="grid grid-cols-1 w-full mb-6 mt-4 border-b-2 border-b-background/20">
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">Owned</h3>
                <p className="font-bold text-xl">{totalOwned}</p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">Owned Value</h3>
                <p className="font-bold text-xl flex items-center">
                  {totalOwnedValue
                    ? `£${totalOwnedValue.toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">Total Value</h3>
                <p className="font-bold text-xl flex items-center">
                  {totalValue ? `£${totalValue.toLocaleString()}` : "N/A"}
                </p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">
                  Average Price
                </h3>
                <p className="font-bold text-xl flex items-center">
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
