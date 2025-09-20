"use client";

import { useState } from "react";
import { Game } from "@/types/game";
import Link from "next/link";
import ZoomableImageModal from "../ZoomableImageModal";
import { formatDate } from "@/utils/formatters";

type GameCardProps = {
    game: Game;
    onDelete: (id: number) => void;
};

export default function GameCard({ game, onDelete }: GameCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className={`rounded-lg shadow-md p-4 flex flex-col items-center text-center bg-neutral ${!showModal ? "transition hover:scale-105" : ""}`}>
            {game.cover_art && (
                <div onClick={() => setShowModal(true)} className="cursor-pointer">
                <img
                    src={game.cover_art}
                    alt={game.title}
                    className="h-64 object-contain mb-3"
                />
                </div>
            )}

            {showModal && (
                <ZoomableImageModal
                src={game.cover_art || "/placeholder.jpg"}
                alt={game.title}
                onClose={() => setShowModal(false)}
                />
            )}

            <h2 className="font-semibold">
                {game.title ?? ""} {game.special_title ?? ""}
            </h2>
            <p className="text-sm text-gray-800">
                {`${game.developer ?? ""} (${game.release_date?.substring(0, 4)})`}
            </p>
            <p className="mt-2">{game.price ? `£${Number(game.price).toLocaleString()}` : "—"}</p>
            <span className="mt-2 px-2 py-1 rounded text-xs bg-neutral-mid text-background">{game.series ?? ""}</span>
            {game.console ? <span className="mt-2 px-2 py-1 rounded text-xs bg-neutral-mid text-background">{game.console ?? ""}</span> : ""}
            <span
                className={`mt-2 px-2 py-1 rounded text-xs ${
                game.owned
                    ? "bg-green-200 text-success"
                    : "bg-red-200 text-danger"
                }`} 
            >
                {game.owned ? "Owned" : "Wishlist"}
            </span>

            <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-sm text-primary cursor-pointer hover:text-neutral-mid"
            >
                {expanded ? "Hide Details" : "Show Details"}
            </button>

            {expanded && (
                <div className="mt-4 text-left w-full space-y-2 text-sm text-neutral-mid">
                    {game.platform && <p><strong>Platform:</strong> {game.platform.toUpperCase()}</p>}
                    {game.publisher && <p><strong>Publisher:</strong> {game.publisher}</p>}
                    {game.bonus_content?.length ? (
                        <p><strong>Bonus Content:</strong> {game.bonus_content.join(", ")}</p>
                    ) : null}
                    {game.language && <p><strong>Language:</strong> {game.language}</p>}
                    {game.country && <p><strong>Country:</strong> {game.country}</p>}
                    {game.genre?.length ? (
                        <p><strong>Genre:</strong> {game.genre.join(", ")}</p>
                    ) : null}
                    {game.link && (
                        <p>
                        <strong>Link:</strong>{" "}
                        <a
                            href={game.link}
                            target="_blank"
                            className="text-primary cursor-pointer hover:text-neutral-mid"
                        >
                            View
                        </a>
                        </p>
                    )}
                    {game.release_date && <p><strong>Release Date:</strong> {formatDate(game.release_date)}</p>}
                    {game.date_bought && <p><strong>Purchase Date:</strong> {formatDate(game.date_bought)}</p>}
                </div>
            )}
            <div className="mt-3 flex gap-4">
                <Link
                    href={`/games/${game.id}/edit`}
                    className="text-primary cursor-pointer hover:text-neutral-mid"
                >
                    Edit
                </Link>
                <button
                    onClick={() => onDelete(game.id!)}
                    className="text-danger cursor-pointer hover:text-red-500"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};