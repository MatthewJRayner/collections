"use client";

import React, { useState, useEffect } from "react";
import { Film } from "../../types/film";
import FilmCard from "../../components/film/FilmCard";
import { getMostRecent, getRandomWatchlist, getRandomFavourites, getTopDirectors } from "../../utils/trackerHelper";
import Link from "next/link";

export default function FilmPage() {
    const [films, setFilms] = useState<Film[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFilms = films.filter((f) => {
        const query = searchQuery.toLowerCase();
        return (
            f.title.toLowerCase().includes(query) ||
            f.alt_title?.toLowerCase().includes(query) ||
            f.director?.toLowerCase().includes(query) ||
            f.alt_name?.toLowerCase().includes(query) ||
            f.cast?.some((c) => c.actor?.toLowerCase().includes(query)) ||
            f.crew?.some((c) => c.name?.toLowerCase().includes(query))
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

    useEffect(() => {
        fetchFilms();
    }, []);

    function formatRuntime(runtime?: string): string {
        if (!runtime) return "Unknown runtime";
        const [hours, minutes, seconds] = runtime.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + Math.round((seconds || 0) / 60);
        return `${totalMinutes} mins`
    }

    // Stats
    const totalWatched = films.length;
    const totalRating = films.reduce((sum, f) => sum + Number(f.rating || 0), 0);
    const avgRating = films.length > 0 ? Number(totalRating / films.length).toFixed(1) : "0";

    const recent = getMostRecent(films);
    const watchlist = getRandomWatchlist(films);
    const favourites = getRandomFavourites(films);
    const directors = getTopDirectors(films);

    return (
        <div className="p-6">
            <div className="flex justify-start items-center mb-6">
                <h1 className="text-3xl font-bold">Films</h1>
            </div>

            <div className="flex flex-col mb-6 gap-2 relative">
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
                {searchQuery.length > 4 && filteredFilms.length > 0 && (
                    <div className="absolute top-full mt-1 left-0 right-0 bg-white/20 backdrop-blur-md rounded shadow-lg max-w-[350px] overflow-y-auto z-10">
                        {filteredFilms.map((f) => {
                            const query = searchQuery.toLowerCase();
                            const matchesSet = new Set<string>();

                            if (f.title.toLowerCase().includes(query)) matchesSet.add(f.title);
                            if (f.alt_title?.toLowerCase().includes(query)) matchesSet.add(f.alt_title);
                            if (f.director.toLowerCase().includes(query)) matchesSet.add(f.director);
                            if (f.alt_name?.toLowerCase().includes(query)) matchesSet.add(f.alt_name);
                            if (f.cast?.some((c) => c.actor?.toLowerCase().includes(query))) {
                                f.cast.forEach((c) => {
                                    if (c.actor?.toLowerCase().includes(query)) matchesSet.add(c.actor);
                                })
                            }
                            if (f.crew?.some((c) => c.name?.toLowerCase().includes(query))) {
                                f.crew.forEach((c) => {
                                    if (c.name?.toLowerCase().includes(query)) matchesSet.add(c.name);
                                })
                            }

                            const matches = Array.from(matchesSet)

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
                                    className="p-2 transition-all duration-300 hover:text-primary cursor-pointer transition flex space-x-2 items-center"
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

            <div className="flex gap-4 mb-6">
                <div className="rounded p-4 text-center">
                <h3 className="text-sm">Total Seen</h3>
                <p className="font-bold text-xl mt-2">{totalWatched}</p>
                </div>
                <div className="rounded p-4 text-center">
                <h3 className="text-sm">Average Rating</h3>
                <p className="font-bold text-xl mt-2">{avgRating}</p>
                </div>
            </div>

            <div className="space-y-10">
                <Section title="Most Recently Watched">
                    {recent.map(f => <FilmCard key={f.id} film={f} />)}
                </Section>

                <Section title="Random Watchlist Picks">
                    {watchlist.map(f => <FilmCard key={f.id} film={f} />)}
                </Section>

                <Section title="Random Favourites">
                    {favourites.map(f => <FilmCard key={f.id} film={f} />)}
                </Section>

                <div>
                    <h2 className="text-xl font-bold mb-4">Top Directors</h2>
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {directors.map(d => (
                        <li
                        key={d.director}
                        className="relative group bg-neutral p-3 rounded shadow"
                        >
                        <span className="font-semibold">{d.director}</span>
                        <span className="block text-sm text-gray-400">
                            Avg {d.avg.toFixed(1)}
                        </span>

                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-background text-foreground text-sm rounded shadow p-2 whitespace-nowrap">
                            {(() => {
                            const maxRating = Math.max(
                                ...d.films.map(f => Number(f.rating) ?? 0)
                            );
                            const best = d.films.filter(f => Number(f.rating) === maxRating);
                            return best.map(f => f.title).join(", ");
                            })()}
                        </div>
                        </li>
                    ))}
                    </ul>
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