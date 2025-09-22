"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import BookCard from "@/components/book/BookCard";

type SortOption = "date-desc" | "date-asc" | "rating-desc" | "rating-asc";

export default function BookSearchPage() {
  const { category, query } = useParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!category || !query) return;
    setLoading(true);

    fetch(`http://127.0.0.1:8000/api/books/?${category}=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, [category, query]);

  const filteredBooks = books.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
        b.title.toLowerCase().includes(query) ||
        b.alt_title?.toLowerCase().includes(query) ||
        b.author?.toLowerCase().includes(query) ||
        b.alt_name?.toLowerCase().includes(query)
    );
  });

  // Sorting logic
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date_published || 0).getTime() - new Date(a.date_published || 0).getTime();
      case "date-asc":
        return new Date(a.date_published || 0).getTime() - new Date(b.date_published || 0).getTime();
      case "rating-desc":
        return (Number(b.rating) ?? 0) - (Number(a.rating) ?? 0);
      case "rating-asc":
        return (Number(a.rating) ?? 0) - (Number(b.rating) ?? 0);
      default:
        return 0;
    }
  });

  if (loading) return <p>Loading...</p>;

  let headingText = `Books`

  if (category?.toLowerCase() === "author") {
    headingText = "written by";
  } else if (category?.toLowerCase() === "language") {
    headingText = "Books in";
  } else if (category?.toLowerCase() === "genre") {
    headingText = "Books about";
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
            <h3 className="text-gray-400 text-sm uppercase">
                {headingText}
            </h3>
            <h1 className="text-2xl font-bold">
            {query && category && (
                `${decodeURIComponent(query)}`
            )}
            </h1>
        </div>
        

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="p-2 rounded bg-neutral shadow cursor-pointer"
        >
          <option value="date-desc">Release Date (Newest → Oldest)</option>
          <option value="date-asc">Release Date (Oldest → Newest)</option>
          <option value="rating-desc">Rating (High → Low)</option>
          <option value="rating-asc">Rating (Low → High)</option>
        </select>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search within results..."
          className="w-1/3 p-2 border rounded-md bg-neutral text-foreground"
        />
      </div>

      {sortedBooks.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {sortedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </ul>
      )}
    </div>
  );
}
