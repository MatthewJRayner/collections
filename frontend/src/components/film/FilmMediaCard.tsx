"use client";

import { useState } from "react";
import { FilmPhysical } from "@/types/filmMedia";
import Link from "next/link";
import ZoomableImageModal from "../ZoomableImageModal";

type FilmMediaCardProps = {
    filmMedia: FilmPhysical;
    onDelete: (id: number) => void;
}

export default function FilmMediaCard({ filmMedia, onDelete }: FilmMediaCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className={`rounded-lg shadow-md p-4 flex flex-col items-center text-center bg-neutral ${!showModal ? "transition hover:scale-105" : ""}`}>
            {filmMedia.cover_art && (
                <div onClick={() => setShowModal(true)} className="cursor-pointer">
                    <img 
                        src={filmMedia.cover_art}
                        alt={filmMedia.title}
                        className="h-64 object-contain mb-3"
                    />
                </div>
            )}

            {showModal && (
                <ZoomableImageModal 
                    src={filmMedia.cover_art || "/placeholder.jpg"}
                    alt={filmMedia.title}
                    onClose={() => setShowModal(false)}
                />
            )}

            <h2 className="font-semibold">
                {filmMedia.title}
            </h2>
            <p className="text-sm text-gray-800">{filmMedia.director ?? ""}</p>
            <p className="mt-2">{filmMedia.format}</p>
            <span className={`mt-2 px-2 py-1 rounded text-xs ${
                filmMedia.owned
                    ? "bg-green-200 text-success"
                    : "bg-red-200 text-danger"
            }`}>
                {filmMedia.owned ? "Owned" : "Wishlist"}
            </span>

            <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-sm text-primary cursor-pointer hover:text-neutral-mid"
            >
                {expanded ? "Hide Details" : "Show Details"}
            </button>

            {expanded && (
                <div className="mt-t text-left w-full space-y-2 text-sm text-neutral-mid">
                    {filmMedia.price && <p><strong>Price:</strong> £{filmMedia.price}</p>}
                    {filmMedia.date_bought && <p><strong>Purchase Date:</strong> {filmMedia.date_bought}</p>}
                    {filmMedia.type && <p><strong>Type:</strong> {filmMedia.type}</p>}
                    {filmMedia.special_features && filmMedia.features && (
                        <p><strong>Special Features:</strong> {filmMedia.features.join(", ")}</p>
                    )}
                    {filmMedia.release_year && <p><strong>Release Year:</strong> {filmMedia.release_year}</p>}
                    {filmMedia.genre?.length ? (
                        <p><strong>Genre:</strong> {filmMedia.genre.join(", ")}</p>
                    ) : null}
                    {filmMedia.language && <p><strong>Language:</strong> {filmMedia.language}</p>}
                    {filmMedia.country && <p><strong>Countries:</strong> {filmMedia.country}</p>}
                    {filmMedia.studio && <p><strong>Distributor:</strong> {filmMedia.studio}</p>}
                    {filmMedia.link && (
                        <p>
                        <strong>Link:</strong>{" "}
                        <a
                            href={filmMedia.link}
                            target="_blank"
                            className="text-primary cursor-pointer hover:text-neutral-mid"
                        >
                            View
                        </a>
                        </p>
                    )}
                    {filmMedia.runtime && <p><strong>Runtime:</strong> {filmMedia.runtime}</p>}

                </div>
            )}

            <div className="mt-3 flex gap-4">
                <Link
                    href={`/music/${filmMedia.id}/edit`}
                    className="text-primary cursor-pointer hover:text-neutral-mid"
                >
                    Edit
                </Link>
                <button
                    onClick={() => onDelete(filmMedia.id!)}
                    className="text-danger cursor-pointer hover:text-red-500"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};