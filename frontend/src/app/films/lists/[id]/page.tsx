"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Film } from "@/types/film";
import { List } from "@/types/list";
import FilmCard from "@/components/film/FilmCard";
import FilmListModal from "@/components/film/FilmListModal";

export default function ListDetailPage() {
  const { id } = useParams();
  const [list, setList] = useState<List | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [initialListData, setInitialListData] = useState<List | undefined>(
    undefined
  );
  const [sortOption, setSortOption] = useState<
    "" | "release_date_asc" | "release_date_desc" | "rating_asc" | "rating_desc"
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
        setList(undefined);
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

  // Sort films based on sortOption
  const sortedFilms = list?.films
    ? [...list.films].sort((a, b) => {
        if (!sortOption) return 0; // No sorting if sortOption is empty

        const [sortField, sortDirection] = sortOption.split("_") as [
          "release_date" | "rating",
          "asc" | "desc"
        ];

        if (sortField === "release_date") {
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
          return sortDirection === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        if (sortField === "rating") {
          const ratingA = Number(a.rating) ?? 0;
          const ratingB = Number(b.rating) ?? 0;
          return sortDirection === "asc"
            ? ratingA - ratingB
            : ratingB - ratingA;
        }

        return 0;
      })
    : [];

  if (loading) return <p className="p-6 font-sans text-gray-400">Loading...</p>;
  if (!list)
    return <p className="p-6 font-sans text-gray-400">List not found</p>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col border-b-1 border-b-foreground/20 pb-4">
        <div className="flex space-x-2 items-center">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">
            {list.name}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-gray-400">
            {list.films?.length ? `(${list.films.length} Films)` : ""}
          </p>
          <button
            onClick={() => {
              setShowListModal(true);
              setInitialListData(list);
            }}
            className="font-sans hover:text-primary transition-all duration-300 cursor-pointer active:scale-95 text-lg"
          >
            ✎
          </button>
        </div>
        {showListModal && (
          <FilmListModal
            onClose={() => {
              setShowListModal(false);
              setInitialListData(undefined);
            }}
            onCreated={() => {
              fetchList();
              setShowListModal(false);
              setInitialListData(undefined);
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
              e.target.value as
                | ""
                | "release_date_asc"
                | "release_date_desc"
                | "rating_asc"
                | "rating_desc"
            )
          }
          className="font-sans w-full sm:w-1/2 md:w-1/4 text-sm sm:text-base p-2 border-1 border-foreground/20 rounded bg-neutral shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Sort by...</option>
          <option value="release_date_asc">{`Release Date (Oldest -> Newest)`}</option>
          <option value="release_date_desc">{`Release Date (Newest -> Oldest)`}</option>
          <option value="rating_asc">{`Rating (Lowest -> Highest)`}</option>
          <option value="rating_desc">{`Rating (Highest -> Lowest)`}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap:4">
        {sortedFilms.length > 0 ? (
          sortedFilms.map((film) => (
            <div
              key={film.id}
              className={`transition-all duration-300 ${
                film.seen ? "opacity-50 hover:opacity-100" : ""
              }`}
            >
              <FilmCard film={film} />
            </div>
          ))
        ) : (
          <p className="font-sans text-gray-400 text-xs sm:text-sm col-span-full text-center">
            No films in this list.
          </p>
        )}
      </div>
    </div>
  );
}
