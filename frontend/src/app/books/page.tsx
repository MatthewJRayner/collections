"use client";

import React, { useState, useEffect } from "react";
import { Book } from "@/types/book";
import BookCard from "@/components/book/BookCard";
import { getMostRecentBooks, getRandomReadlistBooks, getRandomFavouriteBooks, getTopAuthors } from "../../utils/trackerHelper";
import Link from "next/link";

export default function BookPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBooks = books.filter((b) => {
        const query = searchQuery.toLowerCase();
        return (
            b.title.toLowerCase().includes(query) ||
            b.author?.toLowerCase().includes(query) ||
            b.alt_title?.toLowerCase().includes(query) ||
            b.alt_name?.toLowerCase().includes(query)
        );
    });

    const fetchBooks = () => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/api/books/")
            .then((response) => response.json())
            .then((data) => {
                setBooks(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Stats
    const totalRead = books.length;
    const totalRating = books.reduce((sum, b) => sum + Number(b.rating || 0), 0);
    const avgRating = books.length > 0 ? Number(totalRating / books.length).toFixed(1) : "0";

    const recent = getMostRecentBooks(books);
    const watchlist = getRandomReadlistBooks(books);
    const favourites = getRandomFavouriteBooks(books);
    const authors = getTopAuthors(books);

    return (
        <div className="p-6">
            <div className="flex justify-start items-center mb-6">
                <h1 className="text-3xl font-bold">Books</h1>
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
                        href="/books/new"
                        className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
                    >
                        +
                    </Link>
                    <Link
                        href="/books/collection"
                        className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
                    >
                        Collection
                    </Link>
                </div>
                {searchQuery.length > 4 && filteredBooks.length > 0 && (
                    <div className="absolute top-full mt-1 left-0 right-0 bg-white/20 backdrop-blur-md rounded shadow-lg max-w-[350px] overflow-y-auto z-10">
                        {filteredBooks.map((b) => {
                            const query = searchQuery.toLowerCase();
                            const matchesSet = new Set<string>();

                            if (b.title.toLowerCase().includes(query)) matchesSet.add(b.title);
                            if (b.author.toLowerCase().includes(query)) matchesSet.add(b.author);
                            if (b.alt_title?.toLowerCase().includes(query)) matchesSet.add(b.alt_title);
                            if (b.alt_name?.toLowerCase().includes(query)) matchesSet.add(b.alt_name)

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
                                    key={b.id}
                                    href={`/films/${b.id}`}
                                    className="p-2 transition-all duration-300 hover:text-primary cursor-pointer flex space-x-2 items-center"
                                >
                                    <img 
                                        src={b.cover}
                                        alt={b.title}
                                        className="h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="font-semibold">{highlightMatch(b.title)}</div>
                                    {matches
                                        .filter((m) => m !== b.title)
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
                <h3 className="text-sm">Total Read</h3>
                <p className="font-bold text-xl mt-2">{totalRead}</p>
                </div>
                <div className="rounded p-4 text-center">
                <h3 className="text-sm">Average Rating</h3>
                <p className="font-bold text-xl mt-2">{avgRating}</p>
                </div>
            </div>

            <div className="space-y-10">
                <Section title="Most Recently Watched">
                    {recent.map(b => <BookCard key={b.id} book={b} />)}
                </Section>

                <Section title="Random Reading List Picks">
                    {watchlist.map(b => <BookCard key={b.id} book={b} />)}
                </Section>

                <Section title="Random Favourites">
                    {favourites.map(b => <BookCard key={b.id} book={b} />)}
                </Section>

                <div>
                    <h2 className="text-xl font-bold mb-4">Top Authors</h2>
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {authors.map(a => (
                        <li
                        key={a.author}
                        className="relative group bg-neutral p-3 rounded shadow"
                        >
                        <span className="font-semibold">{a.author}</span>
                        <span className="block text-sm text-gray-400">
                            Avg {a.avg.toFixed(1)}
                        </span>

                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-background text-foreground text-sm rounded shadow p-2 whitespace-nowrap">
                            {(() => {
                            const maxRating = Math.max(
                                ...a.books.map(f => Number(f.rating) ?? 0)
                            );
                            const best = a.books.filter(b => Number(b.rating) === maxRating);
                            return best.map(b => b.title).join(", ");
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{children}</div>
        </div>
    );
}