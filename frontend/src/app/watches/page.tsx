"use client";

import React, { useEffect, useState } from "react";

type Watch = {
    id: number;
    brand: string;
    model: string;
    reference_number?: string;
    price?: string;
    owned: boolean;
    photo?: string;
};

export default function WatchesPage() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/watches/")
      .then((res) => res.json())
      .then((data) => {
        setWatches(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading watches...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Watches</h1>
      {watches.length === 0 ? (
        <p>No watches found.</p>
      ) : (
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {watches.map((watch) => (
            <li
              key={watch.id}
              className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center"
            >
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
              {watch.reference_number && (
                <p className="text-sm text-gray-500">
                  Ref: {watch.reference_number}
                </p>
              )}
              <p className="mt-2 text-gray-700">
                {watch.price ? `£${watch.price}` : "Price N/A"}
              </p>
              <span
                className={`mt-3 px-2 py-1 rounded text-xs ${
                  watch.owned
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {watch.owned ? "Owned" : "Wishlist"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}