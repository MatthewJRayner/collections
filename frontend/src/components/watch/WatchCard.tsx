"use client";

import { useState } from "react";
import { Watch } from "../../types/watch";
import Link from "next/link";
import ZoomableImageModal from "../ZoomableImageModal";

type WatchCardProps = {
  watch: Watch;
  onDelete: (id: number) => void;
};

export default function WatchCard({ watch, onDelete }: WatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <li className={`rounded-lg shadow-md p-4 flex flex-col items-center text-center bg-neutral ${!showModal ? "transition hover:scale-105" : ""}`}>
      {watch.photo && (
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          <img
            src={watch.photo}
            alt={watch.model}
            className="h-64 object-contain mb-3"
          />
        </div>
      )}

      {showModal && (
          <ZoomableImageModal
            src={watch.photo || "/placeholder.jpg"}
            alt={watch.model}
            onClose={() => setShowModal(false)}
          />
      )}

      <h2 className="font-semibold">
        {watch.brand} {watch.collection || ""} {watch.model}
      </h2>
      <p className="text-sm text-gray-800">{watch.reference_number || "—"}</p>
      <p className="mt-2">{watch.price ? `£${Number(watch.price).toLocaleString()}` : "—"}</p>
      <span
        className={`mt-2 px-2 py-1 rounded text-xs ${
          watch.owned
            ? "bg-green-200 text-success"
            : "bg-red-200 text-danger"
        }`}
      >
        {watch.owned ? "Owned" : "Wishlist"}
      </span>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm text-primary cursor-pointer hover:text-neutral-mid"
      >
        {expanded ? "Hide Details" : "Show Details"}
      </button>

      {expanded && (
        <div className="mt-4 text-left w-full space-y-2 text-sm text-neutral-mid">
          {watch.year && <p><strong>Year:</strong> {watch.year}</p>}
          {watch.registration_number && (
            <p><strong>Registration #:</strong> {watch.registration_number}</p>
          )}
          {watch.country && <p><strong>Country:</strong> {watch.country}</p>}
          {watch.diameter && <p><strong>Diameter:</strong> {watch.diameter} mm</p>}
          {watch.movement && <p><strong>Movement:</strong> {watch.movement}</p>}
          {watch.winding && <p><strong>Winding:</strong> {watch.winding}</p>}
          {watch.complications?.length ? (
            <p><strong>Complications:</strong> {watch.complications.join(", ")}</p>
          ) : null}
          {watch.strap && <p><strong>Strap:</strong> {watch.strap}</p>}
          {watch.dial && <p><strong>Dial:</strong> {watch.dial}</p>}
          {watch.case && <p><strong>Case:</strong> {watch.case}</p>}
          {watch.numerals && <p><strong>Numerals:</strong> {watch.numerals}</p>}
          {watch.link && (
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={watch.link}
                target="_blank"
                className="text-primary cursor-pointer hover:text-neutral-mid"
              >
                View
              </a>
            </p>
          )}
          {watch.notes && <p><strong>Notes:</strong> {watch.notes}</p>}
        </div>
      )}

      <div className={`mt-3 flex gap-4`}>
        <Link
          href={`/watches/${watch.id}/edit`}
          className="text-primary cursor-pointer hover:text-neutral-mid"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(watch.id!)}
          className="text-danger cursor-pointer hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </li>
  );
}