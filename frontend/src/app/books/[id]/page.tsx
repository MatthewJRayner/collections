"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Book } from "@/types/book";
import ZoomableImageModal from "@/components/ZoomableImageModal";
import StarRating from "@/components/StarRating";
import ReviewModal from "@/components/ReviewModal";
import Link from "next/link";
import { formatDate, formatPhrase, formatYear } from "@/utils/formatters";

export default function FilmDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [rating, setRating] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);
  const [showAllGenres, setShowAllGenres] = useState(false);
  const MAX_GENRES = 5;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/books/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setRating(data.rating || 0);
      });
  }, [id]);

  const saveReview = async (newReview: string) => {
    if (!book?.id) return;

    const response = await fetch(`http://127.0.0.1:8000/api/bookd/${book.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: newReview, read: true }),
    });

    if (response.ok) {
      const updated = await response.json();
      setBook(updated);
    }
  };

  const updateRating = async (newValue: number) => {
    if (!book?.id) return;

    setRating(newValue);

    await fetch(`http://127.0.0.1:8000/api/books/${book.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: newValue, read: true }),
    });
  };
  
  const toggleSeen = async () => {
    if (!book?.id) return;
    
    const response = await fetch(`http://127.0.0.1:8000/api/books/${book.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !book?.read }),
    });

    if (response.ok) {
      const updated = await response.json();
      setBook(updated);
    }
  };

  const toggleReadlist = async () => {
    if (!book?.id) return;
    
    const response = await fetch(`http://127.0.0.1:8000/api/books/${book.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readlist: !book?.readlist }),
    });

    if (response.ok) {
      const updated = await response.json();
      setBook(updated);
    }
  };

  const toggleFavourite = async () => {
    if (!book?.id) return;
    
    const response = await fetch(`http://127.0.0.1:8000/api/books/${book.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favourite: !book?.favourite }),
    });

    if (response.ok) {
      const updated = await response.json();
      setBook(updated);
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex flex-col w-full items-center justify-center mx-auto">
        <div className="flex flex-1 p-6 gap-6 z-10 justify-center w-full">
          <div className="w-1/4 space-y-2 flex flex-col items-center">
            {book.cover && (
              <div onClick={() => setShowModal(true)} className="cursor-pointer">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="rounded-tr-lg rounded-br-lg rounded-l-xs shadow active:scale-95 cursor-pointer transition shadow-lg"
                />
              </div>
            )}
            {showModal && (
                <ZoomableImageModal
                  src={book.cover || "/placeholder.jpg"}
                  alt={book.title}
                  onClose={() => setShowModal(false)}
                />
            )}
            <div className="w-full flex flex-col items-center justify-center text-center space-x-2">
              <button
                onClick={toggleFavourite}
                className={`font-bold flex space-x-2 rounded-lg items-center justify-center py-2 w-full border-2 ${book.favourite ? "bg-danger/10 border-danger shadow-lg" : "border-neutral-mid"} cursor-pointer mb-2 transition:all duration-300 hover:bg-neutral hover:scale-102 active:scale-90`}
              >
                <span className={`${book.favourite ? "text-danger" : "text-neutral-mid"}`}>❤︎ Favourite</span>
              </button>
              <button 
                onClick={toggleSeen} aria-label="Toggle Seen" 
                className={`font-bold flex space-x-2 rounded-lg items-center justify-center py-2 w-full border-2 ${book.read ? "bg-success/10 border-success shadow-lg" : "border-neutral-mid"} cursor-pointer mb-2 transition:all duration-300 hover:bg-neutral hover:scale-102 active:scale-90`}
              >
                <span className={`${book.read ? "text-success" : "text-neutral-mid"}`}>🕮 {book.read ? "Read" : "Not Read"}</span>
              </button>
              <button 
                onClick={toggleReadlist} aria-label="Toggle Readlist" 
                className={`font-bold flex space-x-2 rounded-lg items-center justify-center py-2 w-full border-2 ${book.readlist ? "bg-primary/10 border-primary shadow-lg" : "border-neutral-mid"} cursor-pointer mb-4 transition:all duration-300 hover:bg-neutral hover:scale-102 active:scale-90`}
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`w-6 h-6 ${
                    book.readlist ? "text-primary" : "text-neutral-mid"
                    }`}
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                {book.readlist ? (
                    <h2 className="text-md text-primary">Reading List</h2>
                ) : (
                    <h2 className="text-md text-neutral-mid">Reading List</h2>
                )}
              </button>
              <Link
                href={`/books/${book.id}/edit`}
                className="mb-2 font-bold text-lg text-neutral-mid cursor-pointer transition-all duration-300 hover:text-primary hover:scale-105 active:scale-90"
              >
                <span className="mr-2">✎</span> Edit this entry
              </Link>
              {book.external_links && (
                <Link
                  href={book.external_links}
                  className="text-lg font-bold text-neutral-mid cursor-pointer transition-all duration-300 hover:text-primary hover:scale-105 active:scale-90"
                >
                  <span className="mr-2">⮺</span> Link
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col w-3/4 pl-6">
            <div>
              {book.series && (
                <span className="text-gray-400 text-lg italic">{book.series}{book.volume ? ` (#${book.volume})` : ""}</span>
              )}
              <h1 className="text-5xl font-bold font-serif flex items-center">
                {book.title ?? ""}{book.alt_title ? <span className="text-lg text-gray-400 ml-4 font-normal">{book.alt_title}</span> : ""}
              </h1>
              
              <Link href={`/books/search/author/${encodeURIComponent(book.author)}`} className="flex w-fit items-center space-x-4 transition-all duration-500 hover:text-primary">
                {book.author && (
                  <p className="font-light text-2xl italic">{book.author}{book.alt_name ? <span className="text-sm text-gray-400 ml-2">{book.alt_name}</span> : ""}</p>
                )}
              </Link>
              <div className="flex my-2 items-center space-x-2">
                <StarRating value={rating || 0} onChange={updateRating} />
                <p className="text-3xl font-bold">{Number(rating).toFixed(0)}</p>
              </div>
            </div>
            <div className="flex flex-col space-x-2 w-full mt-2">
                {book.synopsis && (
                    <div className="mb-12 relative">
                        <p
                            className={`text-md leading-relaxed font-serif font-medium transition-all duration-300 ${
                            showFullSynopsis ? "max-h-none" : "max-h-32 overflow-hidden"
                            }`}
                        >
                        {book.synopsis}
                        </p>

                        {/* Fade-out overlay when truncated */}
                        {!showFullSynopsis && book.synopsis.length > 300 && (
                        <div className="absolute bottom-5 left-0 w-full h-12 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                        )}

                        {book.synopsis.length > 300 && (
                            <button
                                onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                                className="mt-1 cursor-pointer z-10 flex items-center"
                            >
                                <span className="mr-1 font-bold transition hover:text-primary">
                                    {showFullSynopsis ? "Show Less" : "Show More"}
                                </span>
                                <span
                                    className={`transition-transform duration-300 ${
                                    showFullSynopsis ? "rotate-180" : "rotate-0"
                                    }`}
                                >
                                    ▼
                                </span>
                            </button>
                        )}
                    </div>
                )}

                <div className="flex items-center mb-4 mr-4 flex-wrap gap-x-2 gap-y-3">
                    <span className="text-sm text-gray-400">Genres</span>

                    {(showAllGenres ? book.genre : book.genre?.slice(0, MAX_GENRES))?.map(
                        (g, i) => (
                        <Link
                            href={`/books/search/genre/${encodeURIComponent(g)}`}
                            key={i}
                            className="border-b-success border-b-2 px-1 font-bold cursor-pointer hover:border-b-green-800 transition-all duration-500"
                        >
                            {g}
                        </Link>
                        )
                    )}

                    {book.genre && book.genre.length > MAX_GENRES && (
                        <button
                            onClick={() => setShowAllGenres(!showAllGenres)}
                            className="border-b-success border-b-2 px-1 font-bold cursor-pointer hover:text-primary transition"
                        >
                        {showAllGenres ? "Show Less" : "...more"}
                        </button>
                    )}
                </div>
                <p className="text-sm text-gray-400 mb-2">
                    {book.page_count ? `${book.page_count} pages` : ""}{book.format ? `${book.page_count ? `, ${formatPhrase(book.format)}` : `${formatPhrase(book.format)}`}` : ""}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                    {`First published ${book.date_published ? `${formatDate(book.date_published)}` : `${formatYear({ year: book.year_released, year_specificity: Array.isArray(book.year_specificity) ? book.year_specificity.join(",") : book.year_specificity })}`}`}{book.edition_read_year ? ` (Edition read published in ${book.edition_read_year})` : ""}
                </p>
                
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="mt-2 cursor-pointer text-sm z-10 flex items-center mb-2"
                >
                    <span className="mr-1 font-bold transition hover:text-primary">
                        {showDetails ? "Less details" : "Book details"}
                    </span>
                    <span
                        className={`transition-transform duration-300 ${
                        showDetails ? "rotate-180" : "rotate-0"
                        }`}
                    >
                        ▼
                    </span>
                </button>
                {showDetails && (
                <div className="text-left w-full space-y-2 text-sm text-neutral-mid pl-2">
                    {book.alt_title && <p><span className="text-xs text-gray-400 mr-2">Original Language</span> {book.alt_title}</p>}
                    {book.tags && book.tags?.length > 1 && (
                    <div className="flex items-center space-x-2">
                        <span><span className="text-xs text-gray-400 mr-2">Tags</span> </span>
                        {book.tags?.map((g, i) => (
                        <div className="bg-neutral p-1 rounded-md" key={i}>
                            {g}
                        </div>
                        ))}
                    </div>
                    )}
                    {book.series && <p><span className="text-xs text-gray-400 mr-2">Series</span> {book.series}</p>}
                    {book.volume && <p><span className="text-xs text-gray-400 mr-2">Entry #</span> {book.volume}</p>}
                    {book.rating && <p><span className="text-xs text-gray-400 mr-2">Rating</span> {book.rating}/10</p>}
                    {book.og_language && <p><span className="text-xs text-gray-400 mr-2">Language</span> <Link href={`/books/search/language/${encodeURIComponent(book.og_language)}`} className="transition-all duration-500 hover:text-primary">{book.og_language}</Link></p>}
                    {book.country && <p><span className="text-xs text-gray-400 mr-2">Country</span> {book.country}</p>}
                    
                    <p className="pt-4 text-foreground"><span className="text-md font-bold">My Edition</span></p>
                    {book.ISBN && <p><span className="text-xs text-gray-400 mr-2">ISBN</span> {book.ISBN}</p>}
                    {book.publisher && <p><span className="text-xs text-gray-400 mr-2">Publisher</span> {book.publisher}</p>}
                    {book.language && <p><span className="text-xs text-gray-400 mr-2">Language</span> <Link href={`/books/search/language/${encodeURIComponent(book.language)}`} className="transition-all duration-500 hover:text-primary">{book.language}</Link></p>}
                    {book.external_links && (
                    <p>
                    <span className="text-xs text-gray-400 mr-2">Link:</span>{" "}
                    <a
                        href={book.external_links}
                        target="_blank"
                        className="text-primary cursor-pointer hover:text-neutral-mid"
                    >
                        View
                    </a>
                    </p>
                )}
                </div>
                )}

                {book.review ? (
                    <div className="flex flex-col justify-start py-4 relative mt-4">
                        <div className="flex space-x-2 items-center">
                        <h3 className="font-semibold">My Review</h3>
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="text-md cursor-pointer transition-all duration-300 hover:text-primary hover:scale-105 active:scale-90"
                        >
                            ✎
                        </button>
                        </div>

                        <p
                        className={`text-sm text-gray-400 transition-all duration-300 ${
                            showFullReview ? "max-h-none" : "max-h-32 overflow-hidden"
                        }`}
                        >
                        {book.review}
                        </p>

                        {!showFullReview && book.review.length > 300 && (
                        <div className="absolute bottom-10 left-0 w-full h-12 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                        )}

                        {book.review.length > 300 && (
                            <button
                                onClick={() => setShowFullReview(!showFullReview)}
                                className="mt-1 text-sm text-primary cursor-pointer z-10 flex items-center"
                            >
                                <span className="mr-1 font-bold text-neutral-mid transition">
                                    {showFullReview ? "Show Less" : "Show More"}
                                </span>
                                <span
                                    className={`transition-transform duration-300 text-neutral-mid ${
                                    showFullReview ? "rotate-180" : "rotate-0"
                                    }`}
                                >
                                    ▼
                                </span>
                            </button>
                        )}
                    </div>
                    ) : (
                    <div className="py-4 px-2 text-center">
                        <button
                        onClick={() => setShowReviewModal(true)}
                        className="bg-primary text-background px-4 py-2 rounded hover:bg-neutral-mid hover:scale-105 transition cursor-pointer active:scale-95"
                        >
                        + Add Review
                        </button>
                    </div>
                )}

                <ReviewModal 
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onSave={saveReview}
                initialValue={book.review || ""}
                />
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
