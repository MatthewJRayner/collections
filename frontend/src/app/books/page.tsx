"use client";

import React, { useState, useEffect } from "react";
import { Book } from "@/types/book";
import BookCard from "@/components/book/BookCard";
import BookListModal from "@/components/book/BookListModal";
import { getMostRecentBooks, getRandomReadlistBooks, getRandomFavouriteBooks, getTopAuthors } from "../../utils/trackerHelper";
import Link from "next/link";
import { List } from "@/types/list";

export default function BookPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [lists, setLists] = useState<List[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showListModal, setShowListModal] = useState(false);
    const [initialListData, setInitialListData] = useState<List | null>(null);

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

    const fetchLists = () => {
        fetch("http://127.0.0.1:8000/api/lists/?category=book")
            .then((response) => response.json())
            .then((data) => setLists(data))
            .catch((error) => console.error("Error fetching lists:", error));
    };

    useEffect(() => {
        fetchBooks();
        fetchLists();
    }, []);

    // Stats
    const readBooks = books.filter(b => b.read);
    const totalRead = readBooks.length;
    const ratedBooks = books.filter(b => b.rating);
    const totalRating = ratedBooks.reduce((sum, b) => sum + Number(b.rating || 0), 0);
    const avgRating = ratedBooks.length > 0 ? Number(totalRating / ratedBooks.length).toFixed(1) : "0";
    const industryRatedBooks = ratedBooks.filter(b => b.industry_rating)
    const totalDifference = industryRatedBooks.reduce((sum, b) => {
        return sum + (Number(b.rating) - Number(b.industry_rating));
    }, 0);
    const avgDifference = industryRatedBooks.length > 0 ? (totalDifference / industryRatedBooks.length).toFixed(1) : "0";

    const recent = getMostRecentBooks(books);
    const watchlist = getRandomReadlistBooks(books);
    const favourites = getRandomFavouriteBooks(books);
    const authors = getTopAuthors(books);

    return (
        <div className="p-6">
            <div className="flex justify-start items-center mb-6">
                <h1 className="text-3xl font-bold">Books</h1>
            </div>

            <div className="flex space-x-4 w-full">
                <div className="flex flex-col w-8/10">
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
                                            href={`/books/${b.id}`}
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
                            <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                <div className="w-2/10">
                    <div className="flex flex-col items-center bg-neutral shadow-lg h-fit rounded">
                    <div className="pt-4 w-full flex justify-start pl-4">
                        <span className="font-bold">Stats</span>
                    </div>
                    <div className="flex flex-col w-full items-center justify-center mb-6 mt-4 border-b-2 border-b-background/20">
                        <div className="rounded flex space-x-2 items-center w-full justify-between px-4">
                        <h3 className="text-sm font-source font-light">Read</h3>
                        <p className="font-bold text-xl">{totalRead}</p>
                        </div>
                        <div className="rounded flex space-x-2 items-center w-full justify-between p-4">
                        <h3 className="text-sm font-source font-light">Mean Rating</h3>
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
                                    href={`/books/lists/${list.id}`}
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
                            <p className="font-sans text-sm text-gray-400 mb-4">No book lists yet.</p>
                        )}
                        </div>
                        {showListModal && (
                            <BookListModal
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