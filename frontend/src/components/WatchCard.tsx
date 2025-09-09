"use client";

import { useState } from "react";
import { Watch } from "../types/watch";
import Link from "next/link";

type WatchCardProps = {
  watch: Watch;
  onDelete: (id: number) => void;
};

export default function WatchCard({ watch, onDelete }: WatchCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="border rounded-lg shadow p-4 flex flex-col items-center text-center">
      {watch.photo && (
        <img
          src={watch.photo}
          alt={watch.model}
          className="h-32 object-contain mb-3"
        />
      )}
      <h2 className="font-semibold">
        {watch.brand} {watch.model}
      </h2>
      <p className="text-sm text-gray-600">{watch.reference_number || "—"}</p>
      <p className="mt-2">{watch.price ? `£${watch.price}` : "—"}</p>
      <span
        className={`mt-2 px-2 py-1 rounded text-xs ${
          watch.owned
            ? "bg-green-200 text-green-700"
            : "bg-red-200 text-red-700"
        }`}
      >
        {watch.owned ? "Owned" : "Wishlist"}
      </span>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm text-blue-600 hover:underline"
      >
        {expanded ? "Hide Details" : "Show Details"}
      </button>

      {expanded && (
        <div className="mt-4 text-left w-full space-y-2 text-sm text-gray-700">
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
                className="text-blue-600 hover:underline"
              >
                View
              </a>
            </p>
          )}
          {watch.notes && <p><strong>Notes:</strong> {watch.notes}</p>}
        </div>
      )}

      <div className="mt-3 flex gap-4">
        <Link
          href={`/watches/${watch.id}/edit`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(watch.id!)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </li>
  );
}