"use client";

import { useState } from "react";
import { Music } from "../../types/music";
import Link from "next/link";
import ZoomableImageModal from "../ZoomableImageModal";

type MusicCardProps = {
  music: Music;
  onDelete: (id: number) => void;
};

export default function MusicCard({ music, onDelete }: MusicCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showTracks, setShowTracks] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className={`rounded-lg shadow-md p-3 sm:p-4 flex flex-col items-center text-center bg-neutral ${
        !showModal ? "transition md:hover:scale-105" : ""
      }`}
    >
      {music.cover_art && (
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          <img
            src={music.cover_art}
            alt={`${music.title} - ${music.artist}`}
            className="h-48 sm:h-64 object-contain mb-3"
          />
        </div>
      )}

      {showModal && (
        <ZoomableImageModal
          src={music.cover_art || "/placeholder.jpg"}
          alt={`${music.title} - ${music.artist}`}
          onClose={() => setShowModal(false)}
        />
      )}

      <h2 className="font-semibold font-inter text-sm sm:text-base">
        {music.title}
      </h2>
      <p className="text-xs sm:text-sm text-gray-800">
        {music.release_date
          ? `${music.artist} (${music.release_date.substring(0, 4)})`
          : `${music.artist}`}
      </p>
      <p className="mt-1 sm:mt-2">
        {music.price ? `£${Number(music.price).toLocaleString()}` : "-"}
      </p>
      <span
        className={`mt-1 sm:mt-2 px-2 py-1 rounded text-xs ${
          music.owned ? "bg-green-200 text-success" : "bg-red-200 text-danger"
        }`}
      >
        {music.owned ? "Owned" : "Wishlist"}
      </span>

      {music.tracklist && music.tracklist.length > 0 && (
        <div className="mt-2 sm:mt-3 w-full flex flex-col">
          <button
            onClick={() => setShowTracks(!showTracks)}
            className="flex w-full text-sm md:text-base items-center justify-center cursor-pointer"
          >
            <span
              className={`mr-1 transition ${showTracks ? "text-primary" : ""}`}
            >
              Tracks
            </span>
            <span
              className={`transition duration-400 ${
                showTracks ? "text-primary transform rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {showTracks && (
            <ul className="mt-1 sm:mt-2 space-y-1 text-xs sm:text-sm w-full">
              {music.tracklist.map((track) => (
                <li
                  key={track.track_number}
                  className="ml-2 flex justify-between w-full"
                >
                  <div className="max-w-4/5 text-left truncate">
                    <span className="font-semibold">{track.track_number}</span>{" "}
                    {track.title}
                  </div>
                  <div className="w-1/5">{track.length || "N/A"}</div>
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
        <div className="mt-t text-left w-full space-y-2 text-sm text-neutral-mid">
          {music.format && (
            <p>
              <strong>Format:</strong>{" "}
              {music.format.charAt(0).toUpperCase() + music.format.slice(1)}
            </p>
          )}
          {music.type && (
            <p>
              <strong>Type:</strong>{" "}
              {music.type.charAt(0).toUpperCase() + music.type.slice(1)}
            </p>
          )}
          {music.release_date && (
            <p>
              <strong>Release Date:</strong> {music.release_date}
            </p>
          )}
          {music.catalog_number && (
            <p>
              <strong>Catalog #:</strong> {music.catalog_number}
            </p>
          )}
          {music.genre?.length ? (
            <p>
              <strong>Genre:</strong> {music.genre.join(", ")}
            </p>
          ) : null}
          {music.length && (
            <p>
              <strong>Length:</strong> {music.length}
            </p>
          )}
          {music.language && (
            <p>
              <strong>Language:</strong> {music.language}
            </p>
          )}
          {music.country && (
            <p>
              <strong>Country:</strong> {music.country}
            </p>
          )}
          {music.label && (
            <p>
              <strong>Label:</strong> {music.label}
            </p>
          )}
          {music.link && (
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={music.link}
                target="_blank"
                className="text-primary cursor-pointer hover:text-neutral-mid"
              >
                View
              </a>
            </p>
          )}
          {music.notes && (
            <p>
              <strong>Notes:</strong> {music.notes}
            </p>
          )}
          {music.date_bought && (
            <p>
              <strong>Date Bought:</strong> {music.date_bought}
            </p>
          )}
        </div>
      )}

      <div className="mt-2 sm:mt-3 flex gap-4">
        <Link
          href={`/music/${music.id}/edit`}
          className="text-primary cursor-pointer hover:text-neutral-mid"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(music.id!)}
          className="text-danger cursor-pointer hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
