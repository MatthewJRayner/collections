"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Book } from "@/types/book";
import { List } from "@/types/list";
import BookCard from "@/components/book/BookCard";
import BookListModal from "@/components/book/BookListModal";

export default function ListDetailPage() {
  const { id } = useParams();
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [initialListData, setInitialListData] = useState<List | null>(null);
  const [sortOption, setSortOption] = useState<
    "" | "year_released_asc" | "year_released_desc" | "rating_asc" | "rating_desc"
  >("");

  const fetchList = () => {
    fetch(`http://127.0.0.1:8000/api/lists/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching list:", error);
        setList(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchList();
  }, [id]);

  const sortedBooks = list?.books
    ? [...list.books].sort((a, b) => {
        if (!sortOption) return 0; // No sorting if sortOption is empty

        const [sortField, sortDirection] = sortOption.split("_") as [
          "year_released" | "rating",
          "asc" | "desc"
        ];

        if (sortField === "year_released") {
          const yearA = Number(a.year_released) ?? 0;
          const yearB = Number(b.year_released) ?? 0;
          return sortDirection === "asc" ? yearA - yearB : yearB - yearA;
        }

        if (sortField === "rating") {
          const ratingA = Number(a.rating) ?? 0;
          const ratingB = Number(b.rating) ?? 0;
          return sortDirection === "asc" ? ratingA - ratingB : ratingB - ratingA;
        }

        return 0;
      })
    : [];

  if (loading) return <p className="p-6 font-sans text-gray-400">Loading...</p>;
  if (!list) return <p className="p-6 font-sans text-gray-400">List not found</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col border-b-1 border-b-foreground/20 pb-4">
        <div className="flex space-x-2 items-center">
          <h1 className="text-3xl font-bold font-serif">{list.name}</h1>
          <p className="font-sans text-gray-400">
            {list.books?.length ? `(${list.books.length} Books)` : ""}
          </p>
          <button
            onClick={() => {
              setShowListModal(true);
              setInitialListData(list);
            }}
            className="font-sans hover:text-primary transition-all duration-300 cursor-pointer text-lg"
          >
            ✎
          </button>
        </div>
        {showListModal && (
          <BookListModal
            onClose={() => {
              setShowListModal(false);
              setInitialListData(null);
            }}
            onCreated={() => {
              fetchList();
              setShowListModal(false);
              setInitialListData(null);
            }}
            initialList={initialListData}
          />
        )}
        {list.description && (
          <p className="font-sans mt-2 text-gray-400">{list.description}</p>
        )}
      </div>

      <div className="flex mb-4">
        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(
              e.target.value as "" | "year_released_asc" | "year_released_desc" | "rating_asc" | "rating_desc"
            )
          }
          className="font-sans p-2 border-1 border-foreground/20 rounded bg-neutral shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Sort by...</option>
          <option value="year_released_asc">{`Year Released (Oldest -> Newest)`}</option>
          <option value="year_released_desc">{`Year Released (Newest -> Oldest)`}</option>
          <option value="rating_asc">{`Rating (Lowest -> Highest)`}</option>
          <option value="rating_desc">{`Rating (Highest -> Lowest)`}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {sortedBooks.length > 0 ? (
          sortedBooks.map((book, idx) => (
            <div
              key={idx}
              className={`transition-all duration-300 ${book.read ? "opacity-50 hover:opacity-100" : ""}`}
            >
              <BookCard book={book} />
            </div>
          ))
        ) : (
          <p className="font-sans text-gray-400 col-span-full text-center">
            No books in this list.
          </p>
        )}
      </div>
    </div>
  );
}