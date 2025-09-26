"use client";

import { useState } from "react";
import { BookCopy } from "@/types/bookCopy";
import Link from "next/link";
import ZoomableImageModal from "../ZoomableImageModal";
import { formatDate, formatPhrase } from "@/utils/formatters";

type BookCopyCardProps = {
  bookCopy: BookCopy;
  onDelete: (id: number) => void;
};

export default function BookCopyCard({
  bookCopy,
  onDelete,
}: BookCopyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className={`rounded-lg shadow-md p-3 sm:p-4 flex flex-col items-center text-center bg-neutral ${
        !showModal ? "transition md:hover:scale-105" : ""
      }`}
    >
      {bookCopy.cover_image && (
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          <img
            src={bookCopy.cover_image}
            alt={bookCopy.title}
            className="h-48 sm:h-64 object-contain mb-3"
          />
        </div>
      )}

      {showModal && (
        <ZoomableImageModal
          src={bookCopy.cover_image || "/placeholder.jpg"}
          alt={bookCopy.title}
          onClose={() => setShowModal(false)}
        />
      )}

      <h2 className="font-semibold font-inter text-sm sm:text-base">
        {bookCopy.title}
      </h2>
      <p className="text-xs sm:text-sm text-gray-800">
        {bookCopy.author ?? ""}
        {bookCopy.publication_date
          ? ` (${bookCopy.publication_date.substring(0, 4)})`
          : ""}
      </p>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base">
        {bookCopy.price ?? ""}
      </p>
      <span className="mt-1 sm:mt-2 px-2 py-1 rounded text-xs bg-neutral-mid text-background">
        {formatPhrase(bookCopy.format)}
      </span>
      <span
        className={`mt-1 sm:mt-2 px-2 py-1 rounded text-xs ${
          bookCopy.owned
            ? "bg-green-200 text-success"
            : "bg-red-200 text-danger"
        }`}
      >
        {bookCopy.owned ? "Owned" : "Wishlist"}
      </span>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 sm:mt-3 text-sm text-primary cursor-pointer hover:text-neutral-mid"
      >
        {expanded ? "Hide Details" : "Show Details"}
      </button>

      {expanded && (
        <div className="mt-t text-left w-full space-y-2 text-sm text-neutral-mid">
          {bookCopy.publication_date && (
            <p>
              <strong>Publication Date:</strong>{" "}
              {formatDate(bookCopy.publication_date)}
            </p>
          )}
          {bookCopy.genre?.length ? (
            <p>
              <strong>Genre:</strong> {bookCopy.genre.join(", ")}
            </p>
          ) : null}
          {bookCopy.page_count && (
            <p>
              <strong>Page Count:</strong> {bookCopy.page_count}
            </p>
          )}
          {bookCopy.page_count && (
            <p>
              <strong>Page Count:</strong> {bookCopy.page_count}
            </p>
          )}
          {bookCopy.date_bought && (
            <p>
              <strong>Purchase Date:</strong> {formatDate(bookCopy.date_bought)}
            </p>
          )}
          {bookCopy.language && (
            <p>
              <strong>Language:</strong> {bookCopy.language}
            </p>
          )}
          {bookCopy.country && (
            <p>
              <strong>Countries:</strong> {bookCopy.country}
            </p>
          )}
          {bookCopy.publisher && (
            <p>
              <strong>Publisher:</strong> {bookCopy.publisher}
            </p>
          )}
          {bookCopy.edition && (
            <p>
              <strong>Edition:</strong> {bookCopy.edition}
            </p>
          )}
          {bookCopy.printing && (
            <p>
              <strong>Printing:</strong> {bookCopy.printing}
            </p>
          )}
          {bookCopy.link && (
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={bookCopy.link}
                target="_blank"
                className="text-primary cursor-pointer hover:text-neutral-mid"
              >
                View
              </a>
            </p>
          )}
        </div>
      )}

      <div className="mt-2 sm:mt-3 flex gap-2 sm:gap-4">
        <Link
          href={`/books/collection/${bookCopy.id}/edit`}
          className="text-primary cursor-pointer hover:text-neutral-mid"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(bookCopy.id!)}
          className="text-danger cursor-pointer hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
