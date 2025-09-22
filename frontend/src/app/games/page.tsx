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
    <div className="p-6">
      <div className="flex justify-start items-center mb-6 ">
        <h1 className="text-3xl font-bold mr-4">Game Collection</h1>
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
          href="/games/new"
          className="bg-primary text-white px-2 py-0.5 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
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
        <div className="rounded p-4 text-center">
            <h3 className="text-sm">Total Owned Value</h3>
            <p className="font-bold text-xl mt-2">{Number(totalOwnedValue).toLocaleString()}</p>
        </div>
      </div>

      {loading ? (
        <p>Loading games</p>
      ) : filteredGame.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
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
  );
}