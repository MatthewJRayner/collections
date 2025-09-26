"use client";

import { useState } from "react";
import { Clothing } from "@/types/clothing";
import Link from "next/link";
import ZoomableImageModal from "../ZoomableImageModal";
import { formatPhrase } from "@/utils/formatters";

type ClothesCardProps = {
  clothing: Clothing;
  onDelete: (id: number) => void;
};

export default function ClothesCard({ clothing, onDelete }: ClothesCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className={`rounded-lg shadow-md p-3 sm:p-4 flex flex-col items-center text-center bg-neutral ${
        !showModal ? "transition md:hover:scale-105" : ""
      }`}
    >
      {clothing.pictures && (
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          <img
            src={clothing.pictures}
            alt={clothing.style}
            className="h-48 sm:h-64 object-contain mb-3"
          />
        </div>
      )}

      {showModal && (
        <ZoomableImageModal
          src={clothing.pictures || "/placeholder.jpg"}
          alt={clothing.style}
          onClose={() => setShowModal(false)}
        />
      )}

      <h2 className="font-semibold  font-inter text-sm sm:text-base">
        {clothing.brands} {clothing.style}
      </h2>
      <p className="text-xs sm:text-sm text-gray-800">
        {clothing.colour || "—"}
      </p>
      <p className="mt-1 sm:mt-2">
        {clothing.price ? `£${Number(clothing.price).toLocaleString()}` : "—"}
      </p>
      <div className="flex space-x-2">
        <span className="mt-1 sm:mt-2 px-2 py-1 rounded text-xs bg-neutral-mid text-background">
          {clothing.category ? formatPhrase(clothing.category) : ""}
        </span>
        <span className="mt-1 sm:mt-2 px-2 py-1 rounded text-xs bg-neutral-mid text-background">
          {clothing.type ?? ""}
        </span>
      </div>
      <span
        className={`mt-1 sm:mt-2 px-2 py-1 rounded text-xs ${
          clothing.owned
            ? "bg-green-200 text-success"
            : "bg-red-200 text-danger"
        }`}
      >
        {clothing.owned ? "Owned" : "Wishlist"}
      </span>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 sm:mt-3 text-sm text-primary cursor-pointer hover:text-neutral-mid"
      >
        {expanded ? "Hide Details" : "Show Details"}
      </button>

      {expanded && (
        <div className="mt-4 text-left w-full space-y-2 text-sm text-neutral-mid">
          {clothing.material && (
            <p>
              <strong>Material:</strong> {clothing.material}
            </p>
          )}
          {clothing.preferred_quantity && (
            <p>
              <strong>Preferred Quantity:</strong> x
              {clothing.preferred_quantity}
            </p>
          )}
          {clothing.features?.length ? (
            <p>
              <strong>Features:</strong> {clothing.features.join(", ")}
            </p>
          ) : null}
          {clothing.collection && (
            <p>
              <strong>Collection / Year:</strong> x{clothing.collection}
            </p>
          )}
        </div>
      )}

      <div className={`mt-2 sm:mt-3 flex gap-2 sm:gap-4`}>
        <Link
          href={`/wardrobe/${clothing.id}/edit`}
          className="text-primary cursor-pointer hover:text-neutral-mid"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(clothing.id!)}
          className="text-danger cursor-pointer hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
