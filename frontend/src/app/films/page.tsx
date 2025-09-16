"use client";

import React, { useState, useEffect } from "react";
import { Film } from "../../types/film";
import FilmCard from "../../components/film/FilmCard";
import Link from "next/link";

export default function FilmPage() {
    const [films, setFilms] = useState<Film[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFilms = films.filter((f) => {
        const query = searchQuery.toLowerCase();
        return (
            f.title.toLowerCase().includes(query) ||
            f.director?.toLowerCase().includes(query) ||
            f.genre?.some((g) => g.toLowerCase().includes(query)) ||
            f.cast?.some((c) => c.actor?.toLowerCase().includes(query))
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

    // Stats
    const totalWatched = films.length;
    const totalRating = films.reduce((sum, f) => sum + Number(f.runtime || 0), 0);
    const avgRuntime = films.length > 0 ? Number(totalRating / films.length).toFixed(1) : 0;

    return (
        <div className="p-6">
            <div className="flex justify-start items-center mb-6">
                <h1 className="text-3x1 font-bold">Films</h1>
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
                    href="/films/new"
                    className="bg-primary text-background px-2 py-0.5 hover:bg-neutral-mid hover:scale-105 transition rounded-md"
                >
                    +
                </Link>
            </div>

            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {films.map((film) => (
                    <FilmCard key={film.id} film={film} />
                ))}
            </div>
        </div>
    );
}
