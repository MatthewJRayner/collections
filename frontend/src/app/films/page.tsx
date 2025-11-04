"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Film } from "../../types/film";
import FilmCard from "../../components/film/FilmCard";
import FilmListModal from "@/components/film/FilmListModal";
import {
  getMostRecent,
  getRandomWatchlist,
  getRandomFavourites,
  getTopDirectors,
} from "../../utils/trackerHelper";
import Link from "next/link";
import { List } from "@/types/list";

type FrontpageData = {
  watchlist?: Film[];
  favourites?: Film[];
  recent?: Film[];
  fallback?: Film[];
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function FilmPage() {
  /* ------------------------------------------------------------------ */
  /* 1. Front-page data (watchlist / favourites / recent / fallback)   */
  /* ------------------------------------------------------------------ */
  const [frontpage, setFrontpage] = useState<FrontpageData>({});
  const [frontpageLoading, setFrontpageLoading] = useState(true);

  /* --------------------------------------------------------------- */
  /* 2. Search results (triggered by debounced query)               */
  /* --------------------------------------------------------------- */
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  /* --------------------------------------------------------------- */
  /* 3. Lists (unchanged)                                            */
  /* --------------------------------------------------------------- */
  const [lists, setLists] = useState<List[]>([]);
  const [showListModal, setShowListModal] = useState(false);
  const [initialListData, setInitialListData] = useState<List | undefined>(undefined);

  /* --------------------------------------------------------------- */
  /* 4. UI helpers                                                   */
  /* --------------------------------------------------------------- */
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  /* ------------------------------------------------------------------ */
  /* FETCH: frontpage (once on mount)                                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchFrontpage = async () => {
      setFrontpageLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/films/frontpage/`);
        const data: FrontpageData = await res.json();
        setFrontpage(data);
      } catch (e) {
        console.error("Failed to load frontpage", e);
      } finally {
        setFrontpageLoading(false);
      }
    };
    fetchFrontpage();
  }, []);

  /* ------------------------------------------------------------------ */
  /* FETCH: lists (once on mount)                                       */
  /* ------------------------------------------------------------------ */
  const fetchLists = useCallback(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lists/?category=film`)
      .then((r) => r.json())
      .then(setLists)
      .catch((e) => console.error("Error fetching lists:", e));
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  /* ------------------------------------------------------------------ */
  /* FETCH: search (debounced)                                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!debouncedSearchQuery) {
      setSearchResults([]);
      return;
    }

    const performSearch = async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/films/?q=${encodeURIComponent(
            debouncedSearchQuery
          )}`
        );
        const data: Film[] = await res.json();
        setSearchResults(data);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setSearchLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  /* ------------------------------------------------------------------ */
  /* RESPONSIVE: small screen detection                                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ------------------------------------------------------------------ */
  /* DERIVED DATA (memoised)                                            */
  /* ------------------------------------------------------------------ */
  // All films that are present in the frontpage payload
  const allFrontpageFilms = useMemo(() => {
    const arr: Film[] = [];
    Object.values(frontpage).forEach((list) => list?.forEach((f) => arr.push(f)));
    return arr;
  }, [frontpage]);

  const mostRecent = useMemo(() => getMostRecent(allFrontpageFilms), [allFrontpageFilms]);
  const randomWatchlist = useMemo(() => getRandomWatchlist(allFrontpageFilms), [allFrontpageFilms]);
  const randomFavourites = useMemo(() => getRandomFavourites(allFrontpageFilms), [allFrontpageFilms]);
  const topDirectors = useMemo(() => getTopDirectors(allFrontpageFilms), [allFrontpageFilms]);

  const seenFilms = useMemo(() => allFrontpageFilms.filter((f) => f.seen), [allFrontpageFilms]);
  const totalWatched = seenFilms.length;

  const ratedFilms = useMemo(() => allFrontpageFilms.filter((f) => f.rating), [allFrontpageFilms]);
  const totalRating = ratedFilms.reduce((sum, f) => sum + Number(f.rating || 0), 0);
  const avgRating = allFrontpageFilms.length > 0 ? (totalRating / allFrontpageFilms.length).toFixed(1) : "0";

  const industryRatedFilms = ratedFilms.filter((b) => b.industry_rating);
  const totalDifference = industryRatedFilms.reduce(
    (sum, b) => sum + (Number(b.rating) - Number(b.industry_rating)),
    0
  );
  const avgDifference =
    industryRatedFilms.length > 0 ? (totalDifference / industryRatedFilms.length).toFixed(1) : "0";

  const mostRecentLimited = isSmallScreen ? mostRecent.slice(0, 4) : mostRecent;
  const randomWatchlistLimited = isSmallScreen ? randomWatchlist.slice(0, 4) : randomWatchlist;
  const randomFavouritesLimited = isSmallScreen ? randomFavourites.slice(0, 4) : randomFavourites;

  /* ------------------------------------------------------------------ */
  /* RENDER                                                             */
  /* ------------------------------------------------------------------ */
  if (frontpageLoading) {
    return <p className="p-4 sm:p-6 font-sans text-gray-400">Loading dashboard…</p>;
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col w-full min-h-screen">
      {/* ---------- Header ---------- */}
      <div className="flex justify-start items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-playfair">Films</h1>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-4 w-full">
        {/* ---------- Main column ---------- */}
        <div className="flex flex-col w-full md:w-8/10">
          {/* ---- Search + actions ---- */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4 sm:mb-6">
            <div className="relative w-full sm:w-1/2 md:w-1/3">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 w-full bg-neutral rounded shadow text-base"
              />

              {/* ---- Search dropdown (API results) ---- */}
              {debouncedSearchQuery && (
                <div className="absolute top-[100%] mt-1 left-0 w-full bg-background/20 backdrop-blur-2xl rounded shadow-lg max-h-[300px] overflow-y-auto z-10">
                  {searchLoading ? (
                    <div className="p-2 text-center text-sm text-gray-400">Searching…</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-2 text-center text-sm text-gray-400">No results</div>
                  ) : (
                    searchResults.map((f) => {
                      const query = debouncedSearchQuery.toLowerCase();
                      const matchesSet = new Set<string>();
                      if (f.title.toLowerCase().includes(query)) matchesSet.add(f.title);
                      if (f.alt_title?.toLowerCase().includes(query)) matchesSet.add(f.alt_title);
                      if (f.director?.toLowerCase().includes(query)) matchesSet.add(f.director);
                      if (f.alt_name?.toLowerCase().includes(query)) matchesSet.add(f.alt_name);
                      const matches = Array.from(matchesSet);

                      const highlight = (text: string) => {
                        const regex = new RegExp(`(${query})`, "gi");
                        return text.split(regex).map((part, i) =>
                          part.toLowerCase() === query.toLowerCase() ? (
                            <span key={i} className="font-bold">
                              {part}
                            </span>
                          ) : (
                            part
                          )
                        );
                      };

                      return (
                        <Link
                          key={f.id}
                          href={`/films/${f.id}`}
                          className="p-2 border-b-1 border-b-foreground/20 transition-all duration-300 hover:text-primary active:scale-95 cursor-pointer flex space-x-2 items-center"
                        >
                          <img
                            src={f.poster}
                            alt={f.title}
                            className="h-24 object-cover transition-transform duration-300"
                          />
                          <div className="flex flex-col">
                            <div className="font-semibold text-sm">{highlight(f.title)}</div>
                            {matches
                              .filter((m) => m !== f.title)
                              .map((m, idx) => (
                                <div key={idx} className="text-xs text-gray-400">
                                  {highlight(m)}
                                </div>
                              ))}
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2 sm:mt-0">
              <Link
                href="/films/new"
                className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md text-sm sm:text-base"
              >
                +
              </Link>
              <Link
                href="/films/collections"
                className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md text-sm sm:text-base"
              >
                Collection
              </Link>
            </div>
          </div>

          {/* ---- Dashboard sections (frontpage data) ---- */}
          <div className="space-y-6 sm:space-y-10">
            <Section title="Most Recently Watched">
              {mostRecentLimited.map((f) => (
                <FilmCard key={f.id} film={f} />
              ))}
            </Section>

            <Section title="Random Watchlist Picks">
              {randomWatchlistLimited.map((f) => (
                <FilmCard key={f.id} film={f} />
              ))}
            </Section>

            <Section title="Random Favourites">
              {randomFavouritesLimited.map((f) => (
                <FilmCard key={f.id} film={f} />
              ))}
            </Section>

            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Top Directors</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {topDirectors.map((d) => (
                  <li
                    key={d.director}
                    className="relative group bg-neutral p-3 rounded shadow"
                  >
                    <span className="font-semibold font-sans text-sm sm:text-base">
                      {d.director}
                    </span>
                    <span className="block text-xs sm:text-sm text-gray-400 font-sans">
                      Avg {d.avg.toFixed(1)}
                    </span>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-active:block md:group-hover:block bg-background text-foreground text-xs sm:text-sm rounded shadow p-2 whitespace-nowrap max-w-[90vw] sm:max-w-[300px] truncate">
                      {d.films
                        .filter((f) => f.rating)
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

        {/* ---------- Sidebar (stats + lists) ---------- */}
        <div className="w-full md:w-2/10 mt-4 md:mt-0">
          <div className="bg-neutral shadow-lg h-fit rounded">
            {/* Stats */}
            <div className="pt-4 w-full flex justify-start pl-4">
              <span className="font-bold font-sans text-sm sm:text-base">Stats</span>
            </div>
            <div className="grid grid-cols-1 mb-6 mt-4 border-b-2 border-b-background/20">
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-xs sm:text-sm font-source font-light">Total Seen</h3>
                <p className="font-bold text-lg sm:text-xl mt-2">{totalWatched}</p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-xs sm:text-sm font-source font-light">Average Rating</h3>
                <p className="font-bold text-xl flex items-center">
                  {avgRating}
                  {avgDifference ? (
                    Number(avgDifference) > 0 ? (
                      <span className="text-xs ml-1 text-success">+{avgDifference}</span>
                    ) : (
                      <span className="text-xs ml-1 text-danger">{avgDifference}</span>
                    )
                  ) : null}
                </p>
              </div>
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 mb-6 mt-4 border-b-2 border-b-background/20 p-4">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <span className="font-bold font-sans text-sm sm:text-base">Lists</span>
                <button
                  className="bg-primary text-white px-1 text-center rounded-lg transition-all duration-300 hover:text-background hover:bg-neutral-mid active:scale-95 cursor-pointer text-sm sm:text-base"
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
                        className="font-sans text-foreground/75 text-xs sm:text-sm font-semibold hover:text-primary transition-all duration-300"
                      >
                        {list.name}
                      </Link>
                      <button
                        onClick={() => {
                          setShowListModal(true);
                          setInitialListData(list);
                        }}
                        className="font-sans text-foreground/75 hover:text-primary transition-all duration-300 active:scale-95 cursor-pointer text-sm sm:text-base"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-sans text-xs sm:text-sm text-gray-400 mb-4">
                  No film lists yet.
                </p>
              )}
            </div>

            {/* List modal */}
            {showListModal && (
              <FilmListModal
                onClose={() => {
                  setShowListModal(false);
                  setInitialListData(undefined);
                }}
                onCreated={() => {
                  fetchLists();
                  setShowListModal(false);
                  setInitialListData(undefined);
                }}
                initialList={initialListData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simple reusable section component (unchanged)                      */
/* ------------------------------------------------------------------ */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {children}
      </div>
    </div>
  );
}