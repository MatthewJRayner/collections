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

          <div>
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
                    <p className={`font-bold flex items-center ${totalOwnedValue > 5 ? "text-md" : "text-lg"}`}>{totalOwnedValue ? `£${totalOwnedValue.toLocaleString()}` : "£0"}</p>
                </div>
                <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                    <h3 className="text-sm font-source font-light">Total Value</h3>
                    <p className={`font-bold flex items-center ${totalValue > 5 ? "text-md" : "text-lg"}`}>{totalValue ? `£${totalValue.toLocaleString()}` : "£0"}</p>
                </div>
                <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                    <h3 className="text-sm font-source font-light">Average Price</h3>
                    <p className={`font-bold flex items-center ${Number(avgPrice) > 5 ? "text-md" : "text-lg"}`}>{avgPrice ? `£${Number(avgPrice).toLocaleString()}` : "£0"}</p>
                </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}