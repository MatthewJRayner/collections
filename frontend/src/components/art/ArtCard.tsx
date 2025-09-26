"use client";

import { useState } from "react";
import { Art } from "@/types/art";
import Link from "next/link";
import { formatYear } from "@/utils/formatters";
import ZoomableImageModal from "../ZoomableImageModal";

type ArtCardProps = {
  art: Art;
  onDelete: (id: number) => void;
};

export default function ArtCard({ art, onDelete }: ArtCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className={`rounded-lg shadow-md p-3 sm:p-4 flex flex-col items-center text-center bg-neutral ${
        !showModal ? "transition md:hover:scale-105" : ""
      }`}
    >
      {art.photo && (
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          <img
            src={art.photo}
            alt={art.title}
            className="h-48 sm:h-64 object-contain mb-3"
          />
        </div>
      )}

      {showModal && (
        <ZoomableImageModal
          src={art.photo || "/placeholder.jpg"}
          alt={art.title}
          onClose={() => setShowModal(false)}
        />
      )}

      <h2 className="font-semibold font-inter text-sm sm:text-base">
        {art.title ?? ""}
      </h2>
      <p className="text-xs sm:text-sm text-gray-800">
        {`${art.artist ?? art.culture ?? ""} (${formatYear({
          year: art.year,
          year_specificity: Array.isArray(art.year_specificity)
            ? art.year_specificity.join(",")
            : art.year_specificity,
        })})`}
      </p>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base">
        {art.price ? `£${Number(art.price).toLocaleString()}` : "—"}
      </p>
      <span
        className={`mt-1 sm:mt-2 px-2 py-1 rounded text-xs ${
          art.owned ? "bg-green-200 text-success" : "bg-red-200 text-danger"
        }`}
      >
        {art.owned ? "Owned" : "Wishlist"}
      </span>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 sm:mt-3 text-sm text-primary cursor-pointer hover:text-neutral-mid"
      >
        {expanded ? "Hide Details" : "Show Details"}
      </button>

      {expanded && (
        <div className="mt-4 text-left w-full space-y-2 text-sm text-neutral-mid">
          {art.type && (
            <p>
              <strong>Type:</strong> {art.type}
            </p>
          )}
          {art.format && (
            <p>
              <strong>Format:</strong> {art.format}
            </p>
          )}
          {art.movement && (
            <p>
              <strong>Movement:</strong> {art.movement}
            </p>
          )}
          {!art.artist && (
            <p>
              <strong>Country/Culture:</strong> {art.culture ?? ""}
            </p>
          )}
          {art.techniques && (
            <p>
              <strong>Techniques:</strong> {art.techniques}
            </p>
          )}
          {art.tags?.length ? (
            <p>
              <strong>Genre:</strong> {art.tags.join(", ")}
            </p>
          ) : null}
          {art.link && (
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={art.link}
                target="_blank"
                className="text-primary cursor-pointer hover:text-neutral-mid"
              >
                View
              </a>
            </p>
          )}
          {art.info && (
            <p>
              <strong>Info:</strong> {art.info}
            </p>
          )}
          {art.date_bought && (
            <p>
              <strong>Purchase Date:</strong> {art.date_bought}
            </p>
          )}
        </div>
      )}

      <div className={`mt-2 sm:mt-3 flex gap-2 sm:gap-4`}>
        <Link
          href={`/art/${art.id}/edit`}
          className="text-primary cursor-pointer hover:text-neutral-mid"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(art.id!)}
          className="text-danger cursor-pointer hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
