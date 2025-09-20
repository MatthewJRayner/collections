"use client";

import { useState } from "react";
import { Extra } from "@/types/extra";
import Link from "next/link";
import ZoomableImageModal from "../ZoomableImageModal";
import { formatYear } from "@/utils/formatters";

type ExtraCardProps = {
  extra: Extra;
  onDelete: (id: number) => void;
};

export default function ExtraCard({ extra, onDelete }: ExtraCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`rounded-lg shadow-md p-4 flex flex-col items-center text-center bg-neutral ${!showModal ? "transition hover:scale-105" : ""}`}>
      {extra.photo && (
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          <img
            src={extra.photo}
            alt={extra.model}
            className="h-64 object-contain mb-3"
          />
        </div>
      )}

      {showModal && (
          <ZoomableImageModal
            src={extra.photo || "/placeholder.jpg"}
            alt={extra.model}
            onClose={() => setShowModal(false)}
          />
      )}

      <h2 className="font-semibold">
        {extra.brand || ""} {extra.model || ""}
      </h2>
      <p className="text-sm text-gray-800">{formatYear({ year: extra.year, year_specificity: Array.isArray(extra.year_specificity) ? extra.year_specificity.join(",") : extra.year_specificity })}</p>
      <p className="mt-2">{extra.price ? `£${Number(extra.price).toLocaleString()}` : "—"}</p>
      <span
        className={`mt-2 px-2 py-1 rounded text-xs ${
          extra.owned
            ? "bg-green-200 text-success"
            : "bg-red-200 text-danger"
        }`}
      >
        {extra.owned ? "Owned" : "Wishlist"}
      </span>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm text-primary cursor-pointer hover:text-neutral-mid"
      >
        {expanded ? "Hide Info" : "Show Info"}
      </button>

      {expanded && (
        <div className="mt-4 text-left w-full space-y-2 text-sm text-neutral-mid">
          {extra.notes && <p>{extra.notes}</p>}
          {extra.links && (
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={extra.links}
                target="_blank"
                className="text-primary cursor-pointer hover:text-neutral-mid"
              >
                View
              </a>
            </p>
          )}
          {extra.date_bought && <p><strong>Date Bought:</strong> {extra.date_bought}</p>}
        </div>
      )}

      <div className={`mt-3 flex gap-4`}>
        <Link
          href={`/extra/${extra.id}/edit`}
          className="text-primary cursor-pointer hover:text-neutral-mid"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(extra.id!)}
          className="text-danger cursor-pointer hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}