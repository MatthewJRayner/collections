"use client";

import { useState } from "react";
import { Performance } from "@/types/performance";
import Link from "next/link";
import { formatYear, formatDate, formatNumeral } from "@/utils/formatters";
import ZoomableImageModal from "../ZoomableImageModal";

type PerformanceCardProps = {
  performance: Performance;
  onDelete: (id: number) => void;
};

export default function PerformanceCard({
  performance,
  onDelete,
}: PerformanceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCast, setShowCast] = useState(false);
  const [showPieces, setShowPieces] = useState(false);

  return (
    <div
      className={`rounded-lg shadow-md p-3 sm:p-4 flex flex-col items-center text-center bg-neutral ${
        !showModal ? "transition md:hover:scale-105" : ""
      }`}
    >
      {performance.images && (
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          <img
            src={performance.images}
            alt={performance.title}
            className="h-48 sm:h-64 object-contain mb-3"
          />
        </div>
      )}

      {showModal && (
        <ZoomableImageModal
          src={performance.images || "/placeholder.jpg"}
          alt={performance.title}
          onClose={() => setShowModal(false)}
        />
      )}

      <h2 className="font-semibold font-inter text-sm sm:text-base">
        {performance.original_title
          ? performance.original_title
          : performance.title
          ? performance.title
          : ""}
      </h2>
      <p className="text-xs sm:text-sm text-gray-800">
        {`${performance.creator ?? ""} (${formatYear({
          year: performance.year,
          year_specificity: Array.isArray(performance.year_specificity)
            ? performance.year_specificity.join(",")
            : performance.year_specificity,
        })})`}
      </p>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base">
        {performance.performance_type ?? ""}
      </p>
      <div className="flex space-x-2">
        {performance.language_heard ? (
          <span className="mt-1 sm:mt-2 px-2 py-1 rounded text-xs bg-neutral-mid text-background">
            {performance.language_heard ?? ""}
          </span>
        ) : performance.original_language ? (
          <span className="mt-1 sm:mt-2 px-2 py-1 rounded text-xs bg-neutral-mid text-background">
            {performance.original_language ?? ""}
          </span>
        ) : (
          ""
        )}
        <span
          className={`mt-1 sm:mt-2 px-2 py-1 rounded text-xs ${
            performance.seen
              ? "bg-green-200 text-success"
              : "bg-red-200 text-danger"
          }`}
        >
          {performance.seen ? "Seen" : "Watchlist"}
        </span>
      </div>

      {performance.pieces && performance.pieces.length > 0 && (
        <div className="mt-2 sm:mt-3 w-full flex flex-col">
          <button
            onClick={() => setShowPieces(!showPieces)}
            className="flex w-full text-sm md:text-base items-center justify-center cursor-pointer"
          >
            <span
              className={`mr-1 transition ${showPieces ? "text-primary" : ""}`}
            >
              Pieces
            </span>
            <span
              className={`transition duration-400 ${
                showPieces ? "text-primary transform rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {showPieces && (
            <ul className="mt-1 sm:mt-2 space-y-1 text-xs sm:text-sm w-full">
              {performance.pieces.map((piece, idx) => (
                <li key={idx} className="ml-2 sm:ml-4">
                  <div className="flex justify-between items-start w-full">
                    <div className="max-w-[90%] sm:max-w-[80%]">
                      <span className="font-semibold">{piece.title}</span>
                      {piece.composer && (
                        <span className="text-gray-400">
                          {" "}
                          by {piece.composer}
                        </span>
                      )}
                      {piece.movements.length > 0 && (
                        <ul className="ml-4 sm:ml-6 mt-1 space-y-1">
                          {piece.movements.map((movement, mIdx) => (
                            <li key={mIdx} className="text-gray-300">
                              {movement.number && (
                                <>
                                  {movement.number.match(/^\d+$/)
                                    ? formatNumeral(parseInt(movement.number))
                                    : movement.number}
                                  .{" "}
                                </>
                              )}
                              {movement.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {performance.cast && performance.cast.length > 0 && (
        <div className="mt-2 sm:mt-3 w-full flex flex-col">
          <button
            onClick={() => setShowCast(!showCast)}
            className="flex w-full text-sm md:text-base items-center justify-center cursor-pointer"
          >
            <span
              className={`mr-1 transition ${showCast ? "text-primary" : ""}`}
            >
              Cast
            </span>
            <span
              className={`transition duration-400 ${
                showCast ? "text-primary transform rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {showCast && (
            <ul className="mt-1 sm:mt-2 space-y-1 text-xs sm:text-sm w-full">
              {performance.cast.map((cast, idx) => (
                <li key={idx} className="ml-2 flex justify-between w-full">
                  <div className="max-w-4/5 text-left truncate">
                    <strong>{cast.character}:</strong> {cast.performer}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 sm:mt-3 text-sm text-primary cursor-pointer hover:text-neutral-mid"
      >
        {expanded ? "Hide Details" : "Show Details"}
      </button>

      {expanded && (
        <div className="mt-4 text-left w-full space-y-2 text-sm text-neutral-mid">
          {performance.writers && performance.writers.length > 0 && (
            <div className="mb-2 text-xs sm:text-sm">
              <span className="font-semibold">Writers: </span>
              {performance.writers.map((writer, idx) => (
                <span key={idx}>
                  {writer.name}
                  {writer.role && ` (${writer.role})`}
                  {idx < (performance.writers?.length ?? 0) - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
          {performance.original_language && (
            <p>
              <strong>Original Language:</strong>{" "}
              {performance.original_language}
            </p>
          )}
          {performance.language_heard && (
            <p>
              <strong>Performance Language:</strong>{" "}
              {performance.language_heard}
            </p>
          )}
          {performance.country && (
            <p>
              <strong>Composer Nationality:</strong> {performance.country}
            </p>
          )}
          {performance.conductor && (
            <p>
              <strong>Conductor:</strong> {performance.conductor}
            </p>
          )}
          {performance.director && (
            <p>
              <strong>Director:</strong> {performance.director}
            </p>
          )}
          {performance.orchestra_ensemble && (
            <p>
              <strong>Orchestra Ensemble:</strong>{" "}
              {performance.orchestra_ensemble}
            </p>
          )}
          {performance.rating && (
            <p>
              <strong>Rating:</strong> {`${performance.rating} / 10`}
            </p>
          )}
          {performance.location_seen && (
            <p>
              <strong>Location:</strong> {formatDate(performance.location_seen)}
            </p>
          )}
          {performance.date_seen && (
            <p>
              <strong>Date Seen:</strong> {formatDate(performance.date_seen)}
            </p>
          )}
          {performance.external_links && (
            <p>
              <strong>external_links:</strong>{" "}
              <a
                href={performance.external_links}
                target="_blank"
                className="text-primary cursor-pointer hover:text-neutral-mid"
              >
                View
              </a>
            </p>
          )}
          {performance.location_premiered && (
            <p>
              <strong>Premiere Location:</strong>{" "}
              {formatDate(performance.location_premiered)}
            </p>
          )}
          {performance.date_premiered && (
            <p>
              <strong>Premiere date:</strong>{" "}
              {formatDate(performance.date_premiered)}
            </p>
          )}
          {performance.review && (
            <p>
              <strong>Review:</strong> {formatDate(performance.review)}
            </p>
          )}
        </div>
      )}
      <div className="mt-2 sm:mt-3 flex gap-2 sm:gap-4">
        <Link
          href={`/performances/${performance.id}/edit`}
          className="text-primary cursor-pointer hover:text-neutral-mid"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(performance.id!)}
          className="text-danger cursor-pointer hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
