"use client";

import { useState } from "react";
import { Performance } from "@/types/performance";
import PiecesEditor from "./PiecesEditor";
import CastEditor from "./CastEditor";

type PerformanceFormProps = {
  initialData?: Performance;
  onSuccess: () => void;
};

export default function PerformanceForm({ initialData, onSuccess }: PerformanceFormProps) {
  const [formData, setFormData] = useState<Performance>(
    initialData || {
      title: "",
      creator: "",
      performance_type: "",
      seen: true,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? e.target instanceof HTMLInputElement
            ? e.target.checked
            : false
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      rating: formData.rating ? parseFloat(formData.rating) : null,
    };

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/performances/${initialData.id}/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/performances/`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    onSuccess();
  };

  return (
    <div className="flex flex-col md:flex-row w-full p-4 sm:p-6">
      <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
        {formData.images && (
          <div className="mb-3 flex flex-col items-center">
            <p className="text-xs sm:text-sm text-silver mb-1 w-full text-left">
              Current Cover Art Preview:
            </p>
            <img
              src={formData.images}
              alt="Cover Art Preview"
              className="object-contain rounded max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
            />
          </div>
        )}
      </div>
      <div className="w-full md:w-1/2 md:pl-2">
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="original_title"
            placeholder="Original Title"
            value={formData.original_title || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="creator"
            placeholder="Composer / Writer / Creator of original work"
            value={formData.creator || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="alt_name"
            placeholder="Original Name"
            value={formData.alt_name || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="performance_type"
            placeholder="Performance Type"
            value={formData.performance_type || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="date"
            name="date_premiered"
            placeholder="Date Premiered"
            value={formData.date_premiered || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="location_premiered"
            placeholder="Location Premiered"
            value={formData.location_premiered || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <select
            name="year_specificity"
            value={formData.year_specificity || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          >
            <option value="">-- Select Year Specificity --</option>
            <option value="exact">Exact</option>
            <option value="year">Year</option>
            <option value="decade">Decade</option>
            <option value="century">Century</option>
            <option value="millennium">Millennium</option>
            <option value="unknown">Unknown</option>
          </select>
          <input
            type="text"
            name="original_language"
            placeholder="Original Language"
            value={formData.original_language || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="language_heard"
            placeholder="Performance Language (If different)"
            value={formData.language_heard || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="country"
            placeholder="Nationality of Composer"
            value={formData.country || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="conductor"
            placeholder="Conductor"
            value={formData.conductor || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="director"
            placeholder="Director"
            value={formData.director || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="orchestra_ensemble"
            placeholder="Orchestra Ensemble"
            value={formData.orchestra_ensemble || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <PiecesEditor
            pieces={formData.pieces || []}
            setPieces={(p) => setFormData({ ...formData, pieces: p })}
          />
          <CastEditor
            cast={formData.cast || []}
            setCast={(c) => setFormData({ ...formData, cast: c })}
          />
          <input
            type="text"
            name="images"
            placeholder="Images URL"
            value={formData.images || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="rating"
            placeholder="Rating"
            value={formData.rating || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="external_links"
            placeholder="Links to any external sites"
            value={formData.external_links || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <textarea
            name="review"
            placeholder="Review"
            value={formData.review || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="location_seen"
            placeholder="Location Seen"
            value={formData.location_seen || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="date"
            name="date_seen"
            placeholder="Date Seen"
            value={formData.date_seen || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <label className="flex items-center space-x-2 text-sm sm:text-base">
            <input
              type="checkbox"
              name="owned"
              checked={formData.seen}
              onChange={handleChange}
            />
            <span>Viewed</span>
          </label>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-neutral-mid hover:text-background hover:scale-105 transition cursor-pointer text-sm sm:text-base"
          >
            {initialData ? "Update Performance" : "Add Performance"}
          </button>
        </form>
      </div>
    </div>
  );
}
