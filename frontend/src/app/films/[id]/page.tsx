"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Film } from "../../../types/film";
import ZoomableImageModal from "@/components/ZoomableImageModal";
import Link from "next/link";

export default function FilmDetailPage() {
  const { id } = useParams();
  const [film, setFilm] = useState<Film | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/films/${id}/`)
      .then((res) => res.json())
      .then(setFilm);
  }, [id]);

  const toggleFavourite = async () => {
    if (!film?.id) return;
    
    const response = await fetch(`http://127.0.0.1:8000/api/films/${film.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favourite: !film?.favourite }),
    });

    if (response.ok) {
      const updated = await response.json();
      setFilm(updated);
    }
  };

  if (!film) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      {film.background_pic && (
        <div className="absolute top-0 left-0 w-full h-[60vh] flex justify-center -z-10">
          {/* Image wrapper, relative so shadows align to it */}
          <div className="relative h-full w-2/3">
            <img
              src={film.background_pic}
              alt={film.title}
              className="h-full w-full object-cover object-top"
            />

            {/* Bottom gradient for blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background"></div>

            {/* Left shadow, now relative to the image */}
            <div className="absolute inset-y-0 left-0 w-18 bg-gradient-to-r from-background via-background/60 to-transparent"></div>

            {/* Right shadow */}
            <div className="absolute inset-y-0 right-0 w-18 bg-gradient-to-l from-background via-background/60 to-transparent"></div>
          </div>
        </div>
      )}

      <div className="h-1/3"></div>

      {/* Content Section */}
      <div className="flex flex-col">
        <div className="h-[30vh]"></div>
        <div className="flex flex-1 p-6 gap-6 z-10">
          {/* Left column */}
          <div className="w-1/4 pb-6 pl-6 space-y-4 flex flex-col items-center">
            {film.poster && (
              <div onClick={() => setShowModal(true)} className="cursor-pointer">
                <img
                  src={film.poster}
                  alt={film.title}
                  className="rounded-lg shadow active:scale-95 cursor-pointer transition"
                />
              </div>
            )}
            {showModal && (
                <ZoomableImageModal
                  src={film.poster || "/placeholder.jpg"}
                  alt={film.title}
                  onClose={() => setShowModal(false)}
                />
            )}
            <div className="w-1/2 flex justify-between items-center text-center">
              {film.runtime && (
                <p className="text-sm text-gray-300">⧗ {film.runtime}</p>
              )}
              <button
                onClick={toggleFavourite}
                className={`shadow text-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-90 ${film?.favourite ? "text-danger" : "text-neutral-mid"}`}
              >
                ❤︎
              </button>
            </div>
          </div>

          {/* Center column */}
          <div className="w-2/4 space-y-4">
            <div>
              <h1 className="text-4xl font-bold">
                {film.title}{" "}
              </h1>
              <div className="flex items-center space-x-2">
                <h2 className="text-2-xl">
                  {film.release_date && (
                    <span className="text-gray-400 text-lg">({film.release_date.substring(0,4)})</span>
                  )}
                </h2>
                {film.director && (
                  <p className="text-gray-300 text-sm">Directed by {film.director}</p>
                )}
              </div>
            </div>

            {film.synopsis && (
              <p className="text-sm leading-relaxed">{film.synopsis}</p>
            )}

            {/* Cast & Crew Accordions */}
            <div>
              <details className="mb-2">
                <summary className="cursor-pointer font-semibold">
                  Cast
                </summary>
                <ul className="text-sm pl-4">
                  {film.cast?.map((c, i) => (
                    <li key={i}>{c.actor} - {c.role}</li>
                  ))}
                </ul>
              </details>

              <details>
                <summary className="cursor-pointer font-semibold">
                  Crew
                </summary>
                <ul className="text-sm pl-4">
                  {film.crew?.map((c, i) => (
                    <li key={i}>{c.name} - {c.role}</li>
                  ))}
                </ul>
              </details>
            </div>

            {/* Extra details */}
            <div className="text-sm text-gray-400">
              {film.festival && <p>Premiered at: {film.festival}</p>}
              {film.genre && <p>Genre: {film.genre.join(", ")}</p>}
              {film.tags && <p>Tags: {film.tags.join(", ")}</p>}
            </div>
          </div>

          {/* Right column */}
          <div className="w-1/4 space-y-4">
            {film.date_watched ? (
              <p className="text-green-400">
                Seen on: {film.date_watched|| "Unknown date"}
              </p>
            ) : (
              <p className="text-yellow-400">In Watchlist</p>
            )}

            {film.rating != null && (
              <p className="text-lg">Rating: ⭐ {film.rating}/10</p>
            )}

            <p>Rewatches: {film.rewatch_count || 0}</p>

            {film.review ? (
              <div>
                <h3 className="font-semibold">Review</h3>
                <p className="text-sm">{film.review}</p>
              </div>
            ) : (
              <button
                onClick={() => alert("TODO: open review modal")}
                className="bg-primary text-background px-4 py-2 rounded hover:bg-neutral-mid hover:scale-105 transition cursor-pointer"
              >
                + Add Review
              </button>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
