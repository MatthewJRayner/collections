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
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/films/${id}/`)
      .then((res) => res.json())
      .then(setFilm);
  }, [id]);

  function formatDate(dateString?: string): string {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatRuntime(runtime?: string): string {
    if (!runtime) return "Unknown runtime";
    const [hours, minutes, seconds] = runtime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + Math.round((seconds || 0) / 60);
    return `${totalMinutes} mins`
  }

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
        <div className="absolute top-0 left-0 w-full h-[550px] flex justify-center -z-10">
          {/* Image wrapper, relative so shadows align to it */}
          <div className="relative h-full w-[1200px]">
            <img
              src={film.background_pic}
              alt={film.title}
              className="h-full w-full object-cover object-top"
            />

            {/* Bottom gradient for blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background"></div>

            {/* Left shadow, now relative to the image */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/70 to-transparent"></div>

            {/* Right shadow */}
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/70 to-transparent"></div>
          </div>
        </div>
      )}

      <div className="h-1/3"></div>

      {/* Content Section */}
      <div className="flex flex-col w-[1000px] items-center justify-center mx-auto">
        <div className="h-[42vh]"></div>
        <div className="flex flex-1 p-6 gap-6 z-10 justify-center w-full">
          {/* Left column */}
          <div className="w-1/4 space-y-2 flex flex-col items-center">
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
                <p className="text-sm text-gray-400">{formatRuntime(film.runtime)}</p>
              )}
              <button
                onClick={toggleFavourite}
                className={`text-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-90 ${film?.favourite ? "text-danger" : "text-neutral-mid"}`}
              >
                ❤︎
              </button>
            </div>
          </div>

          {/* Center column */}
          <div className="flex flex-col space-y-2 w-3/4 pl-6">
            <div>
              <h1 className="text-4xl font-bold font-serif">
                {film.title}{" "}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                {film.release_date && (
                  <h2 className=" text-md">{film.release_date.substring(0,4)}</h2>
                )}
                {film.alt_title && (
                  <p className="italic text-gray-400 font-light">{`'${film.alt_title}'`}</p>
                )}
                {film.director && (
                  <p className="text-gray-400 font-light">Directed by <span className="text-foreground">{film.director}</span></p>
                )}
              </div>
            </div>
            <div className="flex space-x-2 w-full mt-2">
                <div className="w-3/5 space-y-4">
                  {film.blurb && (
                    <h6 className="text-sm text-gray-400 ">{film.blurb.toUpperCase()}</h6>
                  )}

                  {film.synopsis && (
                    <p className="text-md text-gray-400 leading-relaxed font-serif font-medium">{film.synopsis}</p>
                  )}

                  {/* Cast & Crew Accordions */}
                  <div className="space-y-2 text-sm">
                    <details className="group">
                      <summary className="cursor-pointer font-semibold flex items-center justify-start transition-colors group-open:text-primary">
                        Cast
                        <span className="transform transition-transform duration-300 group-open:rotate-180 ml-2">
                          ▼
                        </span>
                      </summary>
                      <ul className="text-md pl-4 mt-2 mb-4">
                        {film.cast?.map((c, i) => (
                          <li key={i}>
                            <span className="font-bold">{c.actor}</span> - {c.role}
                          </li>
                        ))}
                      </ul>
                    </details>

                    <details className="group">
                      <summary className="cursor-pointer font-semibold flex items-center justify-start transition-colors group-open:text-primary">
                        Crew
                        <span className="transform transition-transform duration-300 group-open:rotate-180 ml-2">
                          ▼
                        </span>
                      </summary>
                      <ul className="text-md pl-4 mt-2">
                        {film.crew?.map((c, i) => (
                          <li key={i}>
                            <span className="font-bold">{c.name}</span> - {c.role}
                          </li>
                        ))}
                      </ul>
                    </details>

                    <details className="group">
                      <summary className="cursor-pointer font-semibold flex items-center justify-start transition-colors group-open:text-primary">
                        Awards
                        <span className="transform transition-transform duration-300 group-open:rotate-180 ml-2">
                          ▼
                        </span>
                      </summary>
                      <ul className="text-md pl-4 mt-2 mb-4">
                        {film.awards_won?.map((a, i) => (
                          <li key={i}>
                            <span className="font-bold">{a.award}</span> - <span className={`${a.won ? "" : "text-gray-400"}`}>{a.category} {a.won ? "🏆" : "(NOM)"} </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>

                  {/* Extra details */}
                  <div className="flex flex-col space-y-2 mt-4">
                    {film.festival && <p>Premiered at: {film.festival}</p>}
                    {film.genre && (
                      <div className="flex items-center space-x-2">
                        <span>Genres: </span>
                        {film.genre?.map((g, i) => (
                          <div className="bg-neutral p-1 rounded-md" key={i}>
                            {g}
                          </div>
                        ))}
                      </div>
                    )}
                    {film.tags && (
                      <div className="flex items-center space-x-2">
                        <span>Tags: </span>
                        {film.tags?.map((g, i) => (
                          <div className="bg-neutral p-1 rounded-md" key={i}>
                            {g}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="rounded-lg w-2/5 space-y-4 bg-neutral h-fit p-4 flex flex-col items-left">
                  <span className={`px-2 py-1 rounded text-xs w-fit ${
                      film.seen
                          ? "bg-green-200 text-success"
                          : "bg-red-200 text-danger"
                  }`}>
                      {film.seen ? "Seen" : "Watchlist"}
                  </span>

                  {film.rating != null && (
                    <p className="text-lg">Rating: ⭐ {film.rating}/10</p>
                  )}

                  {film.review ? (
                    <div className="flex flex-col justify-start">
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
      </div>
      
    </div>
  );
}
