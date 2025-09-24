"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Film } from "@/types/film";
import FilmCard from "@/components/film/FilmCard";

type SortOption = "date-desc" | "date-asc" | "rating-desc" | "rating-asc";

export default function FilmSearchPage() {
  const { category, query } = useParams();
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedFilms, setDisplayedFilms] = useState<Film[]>([]);
  const [page, setPage] = useState(1);
  const filmsPerPage = 20;

  useEffect(() => {
    if (!category || !query) return;
    setLoading(true);

    const paramMap: { [key: string]: string } = {
      director: "director",
      actor: "actor",
      genre: "genre",
    };
    const param = paramMap[(category.toLocaleString()).toLowerCase()] || category;
    const decodedQuery = decodeURIComponent(query as string);

    fetch(`http://127.0.0.1:8000/api/films/?${param}=${encodeURIComponent(decodedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setFilms(data);
        setDisplayedFilms(data.slice(0, filmsPerPage));
        setPage(1);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching films:", error);
        setFilms([]);
        setDisplayedFilms([]);
        setLoading(false);
      });
  }, [category, query]);

  const filteredFilms = useMemo(() => {
    return films.filter((f) => {
      const queryLower = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(queryLower) ||
        f.alt_title?.toLowerCase().includes(queryLower) ||
        f.director?.toLowerCase().includes(queryLower) ||
        f.alt_name?.toLowerCase().includes(queryLower) ||
        f.cast?.some((c) => c.actor?.toLowerCase().includes(queryLower)) ||
        f.crew?.some((c) => c.name?.toLowerCase().includes(queryLower))
      );
    });
  }, [films, searchQuery]);

  const sortedFilms = useMemo(() => {
    return [...filteredFilms].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.release_date || "1900-01-01").getTime() - new Date(a.release_date || "1900-01-01").getTime();
        case "date-asc":
          return new Date(a.release_date || "1900-01-01").getTime() - new Date(b.release_date || "1900-01-01").getTime();
        case "rating-desc":
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        case "rating-asc":
          return (Number(a.rating) || 0) - (Number(b.rating) || 0);
        default:
          return 0;
      }
    });
  }, [filteredFilms, sortBy]);

  useEffect(() => {
    const newDisplayedFilms = sortedFilms.slice(0, page * filmsPerPage);
    if (
      newDisplayedFilms.length !== displayedFilms.length ||
      newDisplayedFilms.some((film, index) => film.id !== displayedFilms[index]?.id)
    ) {
      setDisplayedFilms(newDisplayedFilms);
    }
  }, [sortedFilms, page, filmsPerPage, displayedFilms]);

  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  if (loading) return <p className="p-6 font-sans text-gray-400">Loading...</p>;

  let headingText = `Films produced by`;

  if (category && (category.toLocaleString()).toLowerCase() === "actor") {
    headingText = "Films starring";
  } else if (category && (category.toLocaleString()).toLowerCase() === "directors") {
    headingText = "Films directed by";
  } else if (category && (category.toLocaleString()) === "genre") {
    headingText = "Films about";
  }

  return (
    <div className="p-6">
      <div className="flex justify-between w-full items-center mb-4">
        <div className="flex flex-col">
          <h3 className="text-gray-400 text-sm uppercase font-sans">
            {headingText}
          </h3>
          <h1 className="text-2xl font-bold font-serif">
            {query && category && `${decodeURIComponent(query as string)}`}
          </h1>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="font-sans p-2 rounded bg-neutral shadow cursor-pointer border-1 border-neutral/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="w-1/3 p-2 border-1 border-neutral/50 rounded-md bg-neutral text-foreground font-sans focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {sortedFilms.length === 0 ? (
        <p className="font-sans text-gray-400">No results found.</p>
      ) : (
        <>
          <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {displayedFilms.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </ul>
          {displayedFilms.length < sortedFilms.length && (
            <div className="mt-6 text-center">
              <button
                onClick={handleShowMore}
                className="font-sans bg-primary text-white px-4 py-2 rounded hover:bg-neutral-mid hover:text-background cursor-pointer"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}