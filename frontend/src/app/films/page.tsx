"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Film } from "../../types/film";
import FilmCard from "../../components/film/FilmCard";
import FilmListModal from "@/components/film/FilmListModal";
import { getMostRecent, getRandomWatchlist, getRandomFavourites, getTopDirectors } from "../../utils/trackerHelper";
import Link from "next/link";
import { List } from "@/types/list";

export default function FilmPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showListModal, setShowListModal] = useState(false);
  const [initialListData, setInitialListData] = useState<List | null>(null);

  const filteredFilms = films.filter((f) => {
    const query = searchQuery.toLowerCase();
    return (
      f.title.toLowerCase().includes(query) ||
      f.alt_title?.toLowerCase().includes(query) ||
      f.director?.toLowerCase().includes(query) ||
      f.alt_name?.toLowerCase().includes(query)
    );
  });

  const fetchFilms = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/films/")
      .then((response) => response.json())
      .then((data) => {
        setFilms(data);
        setLoading(false);
      });
  };

  const fetchLists = () => {
    fetch("http://127.0.0.1:8000/api/lists/?category=film")
      .then((response) => response.json())
      .then((data) => setLists(data))
      .catch((error) => console.error("Error fetching lists:", error));
  };

  useEffect(() => {
    fetchFilms();
    fetchLists();
  }, []);

  // Memoize sections to recompute only when films changes
  const mostRecent = useMemo(() => getMostRecent(films), [films]);
  const randomWatchlist = useMemo(() => getRandomWatchlist(films), [films]);
  const randomFavourites = useMemo(() => getRandomFavourites(films), [films]);
  const topDirectors = useMemo(() => getTopDirectors(films), [films]);

  function formatRuntime(runtime?: string): string {
    if (!runtime) return "Unknown runtime";
    const [hours, minutes, seconds] = runtime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + Math.round((seconds || 0) / 60);
    return `${totalMinutes} mins`;
  }

  // Stats
  const seenFilms = useMemo(() => films.filter(f => f.seen), [films]);
  const totalWatched = seenFilms.length;
  const ratedFilms = useMemo(() => films.filter(f => f.rating), [films]);
  const totalRating = ratedFilms.reduce((sum, f) => sum + Number(f.rating || 0), 0);
  const avgRating = films.length > 0 ? Number(totalRating / films.length).toFixed(1) : "0";
  const industryRatedFilms = ratedFilms.filter(f => f.industry_rating);
  const totalDifference = industryRatedFilms.reduce((sum, f) => {
    return sum + (Number(f.rating) - Number(f.industry_rating));
  }, 0);
  const avgDifference = industryRatedFilms.length > 0 ? (totalDifference / industryRatedFilms.length).toFixed(1) : "0";

  if (loading) return <p className="p-6 font-sans text-gray-400">Loading...</p>;

  return (
    <div className="p-6 flex w-full">
      <div className="flex space-x-4 ">
        <div className="flex flex-col w-8/10">
        <div className="flex justify-start items-center mb-6">
          <h1 className="text-3xl font-bold font-serif">Films</h1>
        </div>

        <div className="flex flex-col mb-6 gap-2 relative w-8/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-1/4 bg-neutral rounded shadow"
            />
            <Link
              href="/films/new"
              className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
            >
              +
            </Link>
            <Link
              href="/films/collections"
              className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
            >
              Collection
            </Link>
          </div>
          {searchQuery.length > 2 && filteredFilms.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white/20 backdrop-blur-md rounded shadow-lg max-w-[350px] overflow-y-auto z-10">
              {filteredFilms.map((f) => {
                const query = searchQuery.toLowerCase();
                const matchesSet = new Set<string>();
                if (f.title.toLowerCase().includes(query)) matchesSet.add(f.title);
                if (f.alt_title?.toLowerCase().includes(query)) matchesSet.add(f.alt_title);
                if (f.director.toLowerCase().includes(query)) matchesSet.add(f.director);
                if (f.alt_name?.toLowerCase().includes(query)) matchesSet.add(f.alt_name);
                const matches = Array.from(matchesSet);
                const highlightMatch = (text: string) => {
                  const regex = new RegExp(`(${query})`, "gi");
                  return text.split(regex).map((part, idx) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                      <span key={idx} className="">{part}</span>
                    ) : (
                      part
                    )
                  );
                };
                return (
                  <Link
                    key={f.id}
                    href={`/films/${f.id}`}
                    className="p-2 border-b-1 border-b-foreground/20 transition-all duration-300 hover:text-primary cursor-pointer flex space-x-2 items-center"
                  >
                    <img
                      src={f.poster}
                      alt={f.title}
                      className="h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="font-semibold">{highlightMatch(f.title)}</div>
                    {matches
                      .filter((m) => m !== f.title)
                      .map((m, idx) => (
                        <div key={idx} className="text-sm text-gray-400">
                          {highlightMatch(m)}
                        </div>
                      ))}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-10">
          <Section title="Most Recently Watched">
            {mostRecent.map((f) => (
              <FilmCard key={f.id} film={f} />
            ))}
          </Section>

          <Section title="Random Watchlist Picks">
            {randomWatchlist.map((f) => (
              <FilmCard key={f.id} film={f} />
            ))}
          </Section>

          <Section title="Random Favourites">
            {randomFavourites.map((f) => (
              <FilmCard key={f.id} film={f} />
            ))}
          </Section>

          <div>
            <h2 className="text-xl font-bold mb-4">Top Directors</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topDirectors.map((d) => (
                <li key={d.director} className="relative group bg-neutral p-3 rounded shadow">
                  <span className="font-semibold font-sans">{d.director}</span>
                  <span className="block text-sm text-gray-400 font-sans">Avg {d.avg.toFixed(1)}</span>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-background text-foreground text-sm rounded shadow p-2 whitespace-nowrap">
                    {d.films
                      .filter(f => f.rating)
                      .sort((a, b) => Number(b.rating) - Number(a.rating))
                      .map((f) => f.title)
                      .join(", ")}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-2/10 flex flex-col items-center bg-neutral shadow-lg h-fit rounded">
        <div className="pt-2">
          <span className="font-bold font-sans">Stats</span>
        </div>
        <div className="flex flex-col mb-6 border-b-2 border-b-background/20 w-full">
          <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
              <h3 className="text-sm font-source font-light">Total Seen</h3>
              <p className="font-bold text-xl">{Number(totalWatched).toLocaleString()}</p>
          </div>
          <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
              <h3 className="text-sm font-source font-light">Average Rating</h3>
              <p className="font-bold text-xl flex items-center">{avgRating}{avgDifference ? Number(avgDifference) > 0 ? <span className="text-xs ml-1 text-success">+{avgDifference}</span> : <span className="text-xs ml-1 text-danger">{avgDifference}</span> : ""}</p>
          </div>
        </div>
        <div className="w-full px-4">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold font-sans">Lists</span>
            <button
              className="bg-primary text-white px-1 text-center rounded-lg transition-all duration-300 hover:text-background hover:bg-neutral-mid cursor-pointer"
              onClick={() => setShowListModal(true)}
            >
              +
            </button>
          </div>
          {lists.length > 0 ? (
            <ul className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
              {lists.map((list) => (
                <li key={list.id} className="flex justify-between items-center">
                  <Link
                    href={`/films/lists/${list.id}`}
                    className="font-sans text-foreground/75 text-sm font-semibold hover:text-primary transition-all duration-300"
                  >
                    {list.name}
                  </Link>
                  <button
                    onClick={() => {
                      setShowListModal(true);
                      setInitialListData(list); // Set initial data for editing
                    }}
                    className="font-sans text-foreground/75 hover:text-primary transition-all duration-300 cursor-pointer text-sm"
                  >
                    ✎
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-sm text-gray-400 mb-4">No film lists yet.</p>
          )}
        </div>
        {showListModal && (
          <FilmListModal
            onClose={() => {
              setShowListModal(false);
              setInitialListData(null);
            }}
            onCreated={() => {
              fetchLists();
              setShowListModal(false);
              setInitialListData(null);
            }}
            initialList={initialListData}
          />
        )}
      </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">{children}</div>
    </div>
  );
}