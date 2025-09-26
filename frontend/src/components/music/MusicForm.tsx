"use client";

import { useState } from "react";
import { Music } from "../../types/music";
import TracklistEditor from "./TracklistEditor";

type MusicFormProps = {
  initialData?: Music;
  onSuccess: () => void;
};

export default function MusicForm({ initialData, onSuccess }: MusicFormProps) {
  const [formData, setFormData] = useState<Music>(
    initialData || {
      title: "",
      artist: "",
      format: "vinyl",
      type: "album",
      owned: false,
      genre: [],
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

  const [genreInput, setGenreInput] = useState(
    (formData.genre || []).join(", ")
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      genre: genreInput
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      length: formData.length
        ? formData.length.length === 5
          ? formData.length + ":00"
          : formData.length
        : null,
      price: formData.price ? parseFloat(formData.price) : null,
    };

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/music/${initialData.id}/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/music/`;

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
        {formData.cover_art && (
          <div className="mb-3 flex flex-col items-center">
            <p className="text-xs sm:text-sm text-silver mb-1 w-full text-left">
              Current Cover Art Preview:
            </p>
            <img
              src={formData.cover_art}
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
            name="artist"
            placeholder="Artist"
            value={formData.artist || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="date"
            name="release_date"
            placeholder="Release Date"
            value={formData.release_date || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <select
            name="format"
            value={formData.format || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          >
            <option value="">-- Select Format --</option>
            <option value="vinyl">Vinyl</option>
            <option value="cd">CD</option>
            <option value="cassette">Cassette</option>
            <option value="8cm">8CM</option>
            <option value="digital">Digital</option>
            <option value="other">Other</option>
          </select>
          <select
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          >
            <option value="">-- Select Type --</option>
            <option value="album">Album</option>
            <option value="single">Single</option>
            <option value="ep">EP</option>
            <option value="live">Live</option>
            <option value="compilation">Compilation</option>
          </select>
          <input
            type="text"
            name="catalog_number"
            placeholder="Catelog #"
            value={formData.catalog_number || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="genre"
            placeholder="Genres (comma separated)"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            className="p-2 w-full rounded bg-neutral shadow text-sm sm:text-base"
          />
          <input
            type="time"
            step="1"
            name="length"
            placeholder="Length"
            value={formData.length || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="cover_art"
            placeholder="Cover Art URL"
            value={formData.cover_art || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="language"
            placeholder="Language"
            value={formData.language || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="label"
            placeholder="Label"
            value={formData.label || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="link"
            placeholder="Link to any external sites"
            value={formData.link || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <TracklistEditor
            tracklist={formData.tracklist || []}
            setTracklist={(t) => setFormData({ ...formData, tracklist: t })}
          />
          <input
            type="date"
            name="date_bought"
            placeholder="Date Bought"
            value={formData.date_bought || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <label className="flex items-center space-x-2 text-sm sm:text-base">
            <input
              type="checkbox"
              name="owned"
              checked={formData.owned}
              onChange={handleChange}
            />
            <span>Owned</span>
          </label>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-neutral-mid hover:text-background hover:scale-105 transition cursor-pointer text-sm sm:text-base"
          >
            {initialData ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
