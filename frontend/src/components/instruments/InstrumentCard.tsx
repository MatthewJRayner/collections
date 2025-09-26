"use client";

import { useState } from "react";
import { Instrument } from "@/types/instrument";
import Link from "next/link";
import ZoomableImageModal from "../ZoomableImageModal";
import { formatPhrase } from "@/utils/formatters";

type InstrumentCardProps = {
  instrument: Instrument;
  onDelete: (id: number) => void;
};

export default function InstrumentCard({
  instrument,
  onDelete,
}: InstrumentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className={`rounded-lg shadow-md p-3 sm:p-4 flex flex-col items-center text-center bg-neutral ${
        !showModal ? "transition md:hover:scale-105" : ""
      }`}
    >
      {instrument.photo && (
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          <img
            src={instrument.photo}
            alt={instrument.name}
            className="h-48 sm:h-64 object-contain mb-3"
          />
        </div>
      )}

      {showModal && (
        <ZoomableImageModal
          src={instrument.photo || "/placeholder.jpg"}
          alt={instrument.name}
          onClose={() => setShowModal(false)}
        />
      )}

      <h2 className="font-semibold font-inter text-sm sm:text-base">
        {instrument.brand} {instrument.name || ""}
      </h2>
      <p className="text-xs sm:text-sm text-gray-800">
        {instrument.type || "—"} {instrument.year ? `(${instrument.year})` : ""}
      </p>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base">
        {instrument.price
          ? `£${Number(instrument.price).toLocaleString()}`
          : "—"}
      </p>
      <div className="flex space-x-2">
        <span className="mt-1 sm:mt-2 px-2 py-1 rounded text-xs bg-neutral-mid text-background">
          {instrument.category ? formatPhrase(instrument.category) : ""}
        </span>
        <span className="mt-1 sm:mt-2 px-2 py-1 rounded text-xs bg-neutral-mid text-background">
          {instrument.instrument ?? ""}
        </span>
      </div>
      <span
        className={`mt-1 sm:mt-2 px-2 py-1 rounded text-xs ${
          instrument.owned
            ? "bg-green-200 text-success"
            : "bg-red-200 text-danger"
        }`}
      >
        {instrument.owned ? "Owned" : "Wishlist"}
      </span>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 sm:mt-3 text-xs sm:text-sm text-primary cursor-pointer hover:text-neutral-mid"
      >
        {expanded ? "Hide Details" : "Show Details"}
      </button>

      {expanded && (
        <div className="mt-4 text-left w-full space-y-2 text-xs sm:text-sm text-neutral-mid">
          {instrument.maker && (
            <p>
              <strong>Maker:</strong> {instrument.maker}
            </p>
          )}
          {instrument.materials && (
            <p>
              <strong>Materials:</strong> {instrument.materials}
            </p>
          )}
          {instrument.country && (
            <p>
              <strong>Country:</strong> {instrument.country}
            </p>
          )}
          {instrument.link && (
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={instrument.link}
                target="_blank"
                className="text-primary cursor-pointer hover:text-neutral-mid"
              >
                {instrument.link}
              </a>
            </p>
          )}
          {instrument.notes && (
            <p>
              <strong>Notes:</strong> {instrument.notes}
            </p>
          )}
          {instrument.date_bought && (
            <p>
              <strong>Date Bought:</strong> {instrument.date_bought}
            </p>
          )}
        </div>
      )}

      <div className={`mt-2 sm:mt-3 flex gap-2 sm:gap-4`}>
        <Link
          href={`/instruments/${instrument.id}/edit`}
          className="text-primary cursor-pointer hover:text-neutral-mid"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(instrument.id!)}
          className="text-danger cursor-pointer hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
