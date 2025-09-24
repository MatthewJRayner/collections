"use client";

import React, { useEffect, useState } from "react";
import { Game } from "@/types/game";
import GameCard from "@/components/games/GameCard";
import Link from "next/link";

export default function ArtPage() {
  const [game, setGame] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGame = game.filter((g) => {
    const query = searchQuery.toLowerCase();
    return (
      g.title?.toLowerCase().includes(query) ||
      g.developer?.toLowerCase().includes(query) ||
      g.series?.toLowerCase().includes(query) ||
      g.genre?.some((g) => g.toLowerCase().includes(query))
    );
  });

  const fetchGames = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/games/")
      .then((response) => response.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const deleteGame = async (id: number) => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    await fetch(`http://127.0.0.1:8000/api/games/${id}/`, {
      method: "DELETE",
    });
    fetchGames();
  };

  
  // Stats
  const totalOwned = game.filter((g) => g.owned).length;
  const totalOwnedValue = game.filter((g) => g.owned).reduce((sum, g) => sum + Number(g.price || 0), 0);
  const totalValue = game.reduce((sum, g) => sum + Number(g.price || 0), 0);
  const avgPrice = game.length > 0 ? Number(totalValue / game.length).toFixed(0) : 0;
  
  return (
    <div className="p-6 w-full">
      <div className="flex justify-start items-center mb-6 ">
        <h1 className="text-3xl font-bold mr-4">Game Collection</h1>
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
              href="/games/new"
              className="bg-primary text-white px-2 py-0.5 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
            >
              +
            </Link>  
          </div>

          <div>
            {loading ? (
              <p>Loading games</p>
            ) : filteredGame.length === 0 ? (
              <p>No games found.</p>
            ) : (
              <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredGame.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onDelete={deleteGame}
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