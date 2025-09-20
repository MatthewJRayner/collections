"use client";

import React, { useEffect, useState } from "react";
import { BookCopy } from "@/types/bookCopy";
import BookCopyCard from "@/components/book/BookCopyCard";
import Link from "next/link";

export default function FilmMediaPage() {
  const [bookCopy, setBookCopy] = useState<BookCopy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookCopy = bookCopy.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.format.toLowerCase().includes(query) ||
      b.publisher?.toLowerCase().includes(query)
    );
  });

  const fetchBookCopy = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/book-collections/")
      .then((response) => response.json())
      .then((data) => {
        setBookCopy(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookCopy();
  }, []);

  const deleteBookCopy = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    await fetch(`http://127.0.0.1:8000/api/book-collections/${id}/`, {
      method: "DELETE",
    });
    fetchBookCopy();
  };

  
  // Stats
  const totalOwned = bookCopy.filter((b) => b.owned).length;
  const totalOwnedValue = bookCopy.filter((b) => b.owned).reduce((sum, b) => sum + Number(b.price || 0), 0);
  const totalValue = bookCopy.reduce((sum, b) => sum + Number(b.price || 0), 0);
  const avgPrice = bookCopy.length > 0 ? Number(totalValue / bookCopy.length).toFixed(0) : 0;
  
  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6 ">
        <h1 className="text-3xl font-bold mr-4">Book Collection</h1>
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
          href="/books/collection/new"
          className="bg-primary text-white px-2 py-0.5 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
        >
          +
        </Link>
        <Link
            href="/books"
            className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
        >
            {`Books`}
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
        <p>Loading book collection...</p>
      ) : filteredBookCopy.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredBookCopy.map((bookCopy) => (
            <BookCopyCard
              key={bookCopy.id}
              bookCopy={bookCopy}
              onDelete={deleteBookCopy}
            />
          ))}
        </ul>
      )}
    </div>
  );
}