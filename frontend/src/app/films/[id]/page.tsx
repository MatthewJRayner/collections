"use client";

import { lazy, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Film } from "../../../types/film";
import ZoomableImageModal from "@/components/ZoomableImageModal";
import StarRating from "@/components/StarRating";
import ReviewModal from "@/components/ReviewModal";
import Link from "next/link";
import { formatDate, formatRuntime } from "@/utils/formatters";
import FilmImageModal from "@/components/film/FilmImageModal";

export default function FilmDetailPage() {
  const { id } = useParams();
  const [film, setFilm] = useState<Film | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [rating, setRating] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"cast" | "crew" | "awards">(
    "cast"
  );
  const [showFullCast, setShowFullCast] = useState(false);
  const [showFullCrew, setShowFullCrew] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const MAX_CAST_CREW = 20;

  const fetchFilm = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/films/${id}/`);
      const data = await res.json();
      setFilm(data);
    } catch (err) {
      console.error("Error fetching film:", err);
    }
  };

  useEffect(() => {
    if (id) fetchFilm();
  }, [id]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/films/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setFilm(data);
        setRating(data.rating || 0);
      });
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const saveReview = async (newReview: string) => {
    if (!film?.id) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/films/${film.id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: newReview, seen: true }),
      }
    );

    if (response.ok) {
      const updated = await response.json();
      setFilm(updated);
    }
  };

  const updateRating = async (newValue: number) => {
    if (!film?.id) return;

    setRating(newValue);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/films/${film.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: newValue, seen: true }),
    });
  };

  const toggleSeen = async () => {
    if (!film?.id) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/films/${film.id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seen: !film?.seen }),
      }
    );

    if (response.ok) {
      const updated = await response.json();
      setFilm(updated);
    }
  };

  const toggleWatchlist = async () => {
    if (!film?.id) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/films/${film.id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchlist: !film?.watchlist }),
      }
    );

    if (response.ok) {
      const updated = await response.json();
      setFilm(updated);
    }
  };

  const toggleFavourite = async () => {
    if (!film?.id) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/films/${film.id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favourite: !film?.favourite }),
      }
    );

    if (response.ok) {
      const updated = await response.json();
      setFilm(updated);
    }
  };

  const handleFilmUpdated = () => {
    window.location.reload();
  };

  if (!film)
    return <p className="p-4 sm:p-6 font-sans text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      {film.background_pic && (
        <div className="absolute top-0 left-0 w-full h-[400px] sm:h-[560px] flex justify-center -z-10">
          <div className="relative h-full w-full">
            <img
              src={film.background_pic}
              alt={film.title}
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background"></div>
          </div>
        </div>
      )}

      <div className="h-[150px] sm:h-[42vh]"></div>

      <div className="flex flex-col w-full max-w-[900px] sm:max-w-[1150px] items-center justify-center mx-auto">
        <div className="flex flex-col md:flex-row flex-1 gap-4 sm:gap-6 z-10 justify-center w-full">
          <div className="w-full md:w-1/4 space-y-2 flex flex-col items-center">
            {film.poster && (
              <div
                onClick={() => setShowModal(true)}
                className="cursor-pointer"
              >
                <img
                  src={film.poster}
                  alt={film.title}
                  className="rounded-lg shadow active:scale-95 cursor-pointer transition w-full max-w-[250px] sm:max-w-[400px]"
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
            <div className="w-full flex items-center justify-center text-center space-x-4 sm:space-x-2 mt-2 text-xs sm:text-sm">
              {film.runtime && (
                <p className="text-gray-400">{formatRuntime(film.runtime)}</p>
              )}
              <button
                onClick={toggleFavourite}
                className={`text-base cursor-pointer transition-all duration-300 hover:text-danger/50 hover:scale-105 active:scale-90 ${
                  film?.favourite ? "text-danger" : "text-neutral-mid"
                }`}
              >
                ❤︎
              </button>
              <Link
                href={`/films/${film.id}/edit`}
                className="text-base text-neutral-mid cursor-pointer transition-all duration-300 hover:text-primary hover:scale-105 active:scale-90"
              >
                ✎
              </Link>
              <button
                onClick={() => setShowImageModal(true)}
                className="text-base text-neutral-mid cursor-pointer transition-all duration-300 hover:text-primary hover:scale-105 active:scale-90"
              >
                🖼
              </button>
              {showImageModal && film.id && film.tmdb_id && (
                <FilmImageModal
                  filmId={film.id}
                  tmdbId={film.tmdb_id}
                  onClose={() => setShowImageModal(false)}
                  onUpdated={handleFilmUpdated}
                />
              )}
              {film.external_links && (
                <Link
                  href={film.external_links}
                  className="text-neutral-mid cursor-pointer transition-all duration-300 hover:text-primary hover:scale-105 active:scale-90"
                >
                  ⮺
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full md:w-3/4 mt-4 md:mt-0">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif flex items-center">
                {film.title ?? film.title}
              </h1>
              {film.series && (
                <span className="text-gray-400 text-xs sm:text-sm">
                  {film.series} (#{film.volume ?? film.volume})
                </span>
              )}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 text-xs sm:text-md">
                {film.release_date && (
                  <h2>{film.release_date.substring(0, 4)}</h2>
                )}
                {film.alt_title && (
                  <p className="italic text-gray-400 font-light">{`'${film.alt_title}'`}</p>
                )}
                {film.director && (
                  <div className="text-gray-400 font-light">
                    DIRECTED BY
                    <Link
                      href={`/films/search/directors/${encodeURIComponent(
                        film.director
                      )}`}
                      className="cursor-pointer text-foreground text-base transition-all duration-500 hover:text-primary ml-1"
                    >
                      {film.director}{" "}
                      {film.alt_name ? (
                        <span className="text-gray-400 ml-1 italic text-xs transition-all duration-500 hover:text-primary">
                          {film.alt_name}
                        </span>
                      ) : (
                        ""
                      )}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 w-full mt-4">
              <div className="w-full md:w-3/5 space-y-4">
                {film.blurb && (
                  <h6 className="text-sm font-source font-light text-gray-400">
                    {film.blurb.toUpperCase()}
                  </h6>
                )}

                {film.synopsis && (
                  <p className="text-md font-inter text-gray-400 leading-relaxed">
                    {film.synopsis}
                  </p>
                )}

                <div className="rounded-lg block md:hidden w-full md:w-2/5 h-fit mt-4 md:mt-0">
                  <div className="w-full text-center border-y-foreground/20 border-y-1 pt-3 flex sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-1/2 flex flex-col items-center">
                      <button
                        onClick={toggleSeen}
                        aria-label="Toggle Seen"
                        className="cursor-pointer mb-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            film.seen
                              ? "text-success"
                              : "text-gray-400 hover:text-green-300"
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      {film.seen ? (
                        <h2 className="text-xs sm:text-md text-green-300">
                          Seen
                        </h2>
                      ) : (
                        <h2 className="text-xs sm:text-md text-gray-400">
                          Not Seen
                        </h2>
                      )}
                    </div>

                    <div className="w-full sm:w-1/2 flex flex-col items-center">
                      <button
                        onClick={toggleWatchlist}
                        aria-label="Toggle Watchlist"
                        className="cursor-pointer mb-2"
                      >
                        <svg
                          xmlns="http://www.w3.0.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            film.watchlist
                              ? "text-primary"
                              : "text-gray-400 hover:text-blue-300"
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                      {film.watchlist ? (
                        <h2 className="text-xs sm:text-md text-blue-300">
                          Watchlist
                        </h2>
                      ) : (
                        <h2 className="text-xs sm:text-md text-gray-400">
                          Watchlist
                        </h2>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center border-b-foreground/20 border-b-1 p-4">
                    <h2 className="text-xs text-gray-400 font-light">
                      {film.rating ? "RATED" : "UNRATED"}
                    </h2>
                    {isSmallScreen ? (
                      <StarRating value={rating || 0} onChange={updateRating} />
                    ) : (
                      ""
                    )}
                  </div>

                  {film.review ? (
                    <div className="flex flex-col w-full py-4 px-2">
                      <div className="flex space-x-2 items-center text-center">
                        <h3 className="font-semibold text-gray-400">Review</h3>
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="text-md cursor-pointer transition-all duration-300 hover:text-primary hover:scale-105 active:scale-90"
                        >
                          ✎
                        </button>
                      </div>
                      <p className="text-sm text-left">{film.review}</p>
                    </div>
                  ) : (
                    <div className="py-4 px-2 text-center">
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="bg-primary text-white hover:text-background px-4 py-2 rounded hover:bg-neutral-mid hover:scale-105 transition cursor-pointer active:scale-95"
                      >
                        + Add Review
                      </button>
                    </div>
                  )}

                  <ReviewModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    onSave={saveReview}
                    initialValue={film.review || ""}
                  />
                </div>

                <div className="space-y-4 pb-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab("cast")}
                      className={`font-sans font-semibold cursor-pointer text-sm sm:text-base ${
                        activeTab === "cast"
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-500"
                      }`}
                    >
                      Cast
                    </button>
                    <button
                      onClick={() => setActiveTab("crew")}
                      className={`font-sans font-semibold cursor-pointer text-sm sm:text-base ${
                        activeTab === "crew"
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-500"
                      }`}
                    >
                      Crew
                    </button>
                    <button
                      onClick={() => setActiveTab("awards")}
                      className={`font-sans font-semibold cursor-pointer text-sm sm:text-base ${
                        activeTab === "awards"
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-500"
                      }`}
                    >
                      Awards
                    </button>
                  </div>

                  <div className="text-xs sm:text-md">
                    {activeTab === "cast" && (
                      <>
                        <div className="mb-6 relative hidden md:block">
                          <div
                            className={`gap-x-2 gap-y-3 flex flex-wrap transition-all duration-300`}
                          >
                            {(showFullCast
                              ? film.cast
                              : film.cast?.slice(0, MAX_CAST_CREW)
                            )?.map((c, i) => (
                              <div key={i} className="relative group">
                                <Link
                                  className="bg-neutral px-2 py-1 w-fit rounded-md text-sm cursor-help transition-all duration-300 hover:bg-neutral/50"
                                  href={`/films/search/actor/${encodeURIComponent(
                                    c.actor
                                  )}`}
                                >
                                  {c.actor}
                                </Link>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20 shadow-lg">
                                  {c.role}
                                </div>
                              </div>
                            ))}

                            {film.cast && film.cast.length > MAX_CAST_CREW && (
                              <button
                                onClick={() => setShowFullCast(!showFullCast)}
                                className="bg-neutral px-2 py-1 w-fit rounded-md text-sm transition-all duration-300 hover:bg-neutral/50 cursor-pointer"
                              >
                                {showFullCast ? "Show Less" : "Show All"}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mb-6 block md:hidden">
                          <div className="grid grid-cols-1">
                            {film.cast?.map((c, i) => (
                              <Link
                                href={`/films/search/actor/${encodeURIComponent(
                                  c.actor
                                )}`}
                                key={i}
                                className="text-sm mb-2 pb-2 items-center relative group flex justify-between border-b-1 border-b-foreground/20"
                              >
                                <div className="flex flex-col space-y-1">
                                  <div className="">{c.actor}</div>
                                  <div className="font-light text-gray-400 font-source">
                                    {c.role}
                                  </div>
                                </div>
                                <div className="font-bold">{`>`}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {activeTab === "crew" && (
                      <>
                        <div className="mb-12 hidden md:block relative">
                          <div
                            className={`space-y-4 flex flex-col transition-all duration-300 ${
                              showFullCrew
                                ? "max-h-none"
                                : "max-h-64 overflow-hidden"
                            }`}
                          >
                            <div className="flex justify-start items-center pr-4 space-x-4">
                              <span className="font-normal text-xs">
                                DIRECTOR
                              </span>
                              <div className="flex flex-wrap gap-2">
                                <Link
                                  className="bg-neutral p-1 w-fit rounded-md text-xs transition-all duration-300 hover:bg-neutral/50"
                                  href={`/films/search/directors/${encodeURIComponent(
                                    film.director
                                  )}`}
                                >
                                  {film.director}
                                </Link>
                              </div>
                            </div>
                            {Object.entries(
                              film.crew?.reduce(
                                (acc: Record<string, string[]>, c) => {
                                  if (!acc[c.role]) acc[c.role] = [];
                                  acc[c.role].push(c.name);
                                  return acc;
                                },
                                {}
                              ) || {}
                            ).map(([role, names]) => (
                              <div
                                key={role}
                                className="flex justify-start items-center pr-4 space-x-4"
                              >
                                <span className="font-normal text-xs">
                                  {role.toUpperCase()}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {names.map((name, idx) => (
                                    <Link
                                      href={`/films/search/crew/${encodeURIComponent(
                                        name
                                      )}`}
                                      key={idx}
                                      className="bg-neutral p-1 w-fit rounded-md text-xs transition-all duration-300 hover:bg-neutral/50"
                                    >
                                      {name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          {!showFullCrew &&
                            film.crew &&
                            film.crew.length > MAX_CAST_CREW && (
                              <div className="absolute bottom-4 left-0 w-full h-12 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                            )}
                          {film.crew && film.crew.length > MAX_CAST_CREW && (
                            <button
                              onClick={() => setShowFullCrew(!showFullCrew)}
                              className="mt-1 cursor-pointer z-10 flex items-center text-xs sm:text-sm"
                            >
                              <span className="mr-1 font-bold transition hover:text-primary">
                                {showFullCrew ? "Show Less" : "Show More"}
                              </span>
                              <span
                                className={`transition-transform duration-300 ${
                                  showFullCrew ? "rotate-180" : "rotate-0"
                                }`}
                              >
                                ▼
                              </span>
                            </button>
                          )}
                        </div>
                        <div className="mb-12 block md:hidden">
                          <div className="grid grid-cols-1">
                            {film.crew?.map((c, i) => (
                              <Link
                                href={`/films/search/crew/${encodeURIComponent(
                                  c.name
                                )}`}
                                key={i}
                                className="mb-2 text-sm pb-2 items-center relative group flex justify-between border-b-1 border-b-foreground/20"
                              >
                                <div className="flex flex-col space-y-1">
                                  <div className="">{c.name}</div>
                                  <div className="font-light text-gray-400 font-source">
                                    {c.role}
                                  </div>
                                </div>
                                <div className="font-bold">{`>`}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {activeTab === "awards" && (
                      <div className="space-y-4 flex flex-col">
                        {(() => {
                          const awards = film.awards_won || [];
                          const totalNominations = awards.length;
                          const totalWins = awards.filter((a) => a.won).length;
                          const tooltipMessage =
                            "Awards from Academy Awards, BAFTA, Golden Globes, Critics' Choice, SAG. Festivals from Cannes, Venice, Berlin, Toronto, Sundance.";

                          return (
                            <div className="mb-2 text-sm text-gray-400 font-sans relative group w-fit">
                              <span className="cursor-help group-hover:text-primary transition">
                                🏆{" "}
                                <span className="text-warning font-semibold">
                                  {totalWins}
                                </span>{" "}
                                Wins ·{" "}
                                <span className="text-primary font-semibold">
                                  {totalNominations}
                                </span>{" "}
                                Nominations
                              </span>

                              <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-neutral-mid text-background text-xs p-2 rounded shadow-lg z-10 w-max max-w-xs whitespace-normal">
                                {tooltipMessage}
                              </div>
                            </div>
                          );
                        })()}

                        {Object.entries(
                          film.awards_won?.reduce(
                            (
                              acc: Record<
                                string,
                                { category: string; won: boolean }[]
                              >,
                              a
                            ) => {
                              if (!acc[a.award]) acc[a.award] = [];
                              acc[a.award].push({
                                category: a.category,
                                won: a.won,
                              });
                              return acc;
                            },
                            {}
                          ) || {}
                        ).map(([award, entries]) => (
                          <div
                            key={award}
                            className="flex justify-start items-center pr-4 space-x-4"
                          >
                            <span className="font-normal text-xs">
                              {award.toUpperCase()}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {entries.map((entry, idx) => (
                                <div
                                  key={idx}
                                  className={`p-1 w-fit rounded-md text-xs ${
                                    entry.won
                                      ? "bg-warning text-white"
                                      : "bg-neutral"
                                  }`}
                                >
                                  {entry.category}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-3 text-xs sm:text-md text-primary cursor-pointer hover:text-neutral-mid"
                >
                  {showDetails ? "Hide Details" : "More Details"}
                </button>
                {showDetails && (
                  <div className="mt-4 text-left w-full space-y-2 text-xs sm:text-sm text-neutral-mid">
                    {film.genre && (
                      <div className="flex items-center space-x-2">
                        <span>
                          <strong>Genres:</strong>{" "}
                        </span>
                        {film.genre?.map((g, i) => (
                          <Link
                            href={`/films/search/genre/${encodeURIComponent(
                              g
                            )}`}
                            className="bg-neutral p-1 rounded-md transition-all duration-300 hover:bg-primary/50"
                            key={i}
                          >
                            {g}
                          </Link>
                        ))}
                      </div>
                    )}
                    {film.tags && film.tags.length > 1 && (
                      <div className="flex items-center space-x-2">
                        <span>
                          <strong>Tags:</strong>{" "}
                        </span>
                        {film.tags?.map((g, i) => (
                          <div className="bg-neutral p-1 rounded-md" key={i}>
                            {g}
                          </div>
                        ))}
                      </div>
                    )}
                    {film.series && (
                      <p>
                        <strong>Series:</strong> {film.series}
                      </p>
                    )}
                    {film.volume && (
                      <p>
                        <strong>Entry #:</strong> {film.volume}
                      </p>
                    )}
                    {film.rating && (
                      <p>
                        <strong>Rating:</strong>{" "}
                        {Number(film.rating).toFixed(0)} / 10
                      </p>
                    )}
                    {film.runtime && (
                      <p>
                        <strong>Runtime:</strong> {formatRuntime(film.runtime)}
                      </p>
                    )}
                    {film.date_watched && (
                      <p>
                        <strong>Date Watched:</strong>{" "}
                        {formatDate(film.date_watched)}
                      </p>
                    )}
                    {film.release_date && (
                      <p>
                        <strong>Release Date:</strong>{" "}
                        {formatDate(film.release_date)}
                      </p>
                    )}
                    {film.festival && (
                      <p>
                        <strong>Premiered at:</strong> {film.festival}
                      </p>
                    )}
                    {film.medium && (
                      <p>
                        <strong>Medium:</strong> {film.medium}
                      </p>
                    )}
                    {!film.colour && (
                      <p>
                        <strong>Colour:</strong> Black & White
                      </p>
                    )}
                    {!film.sound && (
                      <p>
                        <strong>Sound:</strong> Silent
                      </p>
                    )}
                    {film.budget && (
                      <p>
                        <strong>Budget:</strong>{" "}
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(Number(film.budget))}
                      </p>
                    )}
                    {film.box_office && (
                      <p>
                        <strong>Box Office:</strong>{" "}
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(Number(film.box_office))}
                      </p>
                    )}
                    {film.language && (
                      <p>
                        <strong>Language:</strong> {film.language}
                      </p>
                    )}
                    {film.country && (
                      <p>
                        <strong>Country:</strong> {film.country}
                      </p>
                    )}
                    {film.external_links && (
                      <p>
                        <strong>Link:</strong>{" "}
                        <a
                          href={film.external_links}
                          target="_blank"
                          className="text-primary cursor-pointer hover:text-neutral-mid"
                        >
                          View
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-lg hidden md:block w-full md:w-2/5 bg-neutral h-fit mt-4 md:mt-0">
                <div className="w-full text-center border-b-background border-b-1 p-4 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-1/2 flex flex-col items-center">
                    <button
                      onClick={toggleSeen}
                      aria-label="Toggle Seen"
                      className="cursor-pointer mb-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          film.seen
                            ? "text-success"
                            : "text-gray-400 hover:text-green-300"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    {film.seen ? (
                      <h2 className="text-xs sm:text-md text-green-300">
                        Seen
                      </h2>
                    ) : (
                      <h2 className="text-xs sm:text-md text-gray-400">
                        Not Seen
                      </h2>
                    )}
                  </div>

                  <div className="w-full sm:w-1/2 flex flex-col items-center">
                    <button
                      onClick={toggleWatchlist}
                      aria-label="Toggle Watchlist"
                      className="cursor-pointer mb-2"
                    >
                      <svg
                        xmlns="http://www.w3.0.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          film.watchlist
                            ? "text-primary"
                            : "text-gray-400 hover:text-blue-300"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    {film.watchlist ? (
                      <h2 className="text-xs sm:text-md text-blue-300">
                        Watchlist
                      </h2>
                    ) : (
                      <h2 className="text-xs sm:text-md text-gray-400">
                        Watchlist
                      </h2>
                    )}
                  </div>
                </div>

                <div className="flex flex-col font-source items-center border-b-background border-b-1 p-4">
                  <h2 className="text-xs text-gray-400 font-light">
                    {film.rating ? "RATED" : "UNRATED"}
                  </h2>
                  {!isSmallScreen ? (
                    <StarRating value={rating || 0} onChange={updateRating} />
                  ) : (
                    ""
                  )}
                </div>

                {film.review ? (
                  <div className="flex flex-col justify-start py-4 px-2">
                    <div className="flex space-x-2 items-center">
                      <h3 className="font-semibold">Review</h3>
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="text-md cursor-pointer transition-all duration-300 hover:text-primary hover:scale-105 active:scale-90"
                      >
                        ✎
                      </button>
                    </div>
                    <p className="text-sm">{film.review}</p>
                  </div>
                ) : (
                  <div className="py-4 px-2 text-center">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="bg-primary text-white hover:text-background px-4 py-2 rounded hover:bg-neutral-mid hover:scale-105 transition cursor-pointer active:scale-95"
                    >
                      + Add Review
                    </button>
                  </div>
                )}

                <ReviewModal
                  isOpen={showReviewModal}
                  onClose={() => setShowReviewModal(false)}
                  onSave={saveReview}
                  initialValue={film.review || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
