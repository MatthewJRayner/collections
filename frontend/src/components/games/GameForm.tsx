"use client";

import { useState } from "react";
import { Game } from "@/types/game";

type GameFormProps = {
  initialData?: Game;
  onSuccess: () => void;
};

export default function GameForm({ initialData, onSuccess }: GameFormProps) {
  const [formData, setFormData] = useState<Game>(
    initialData || {
      title: "",
      platform: "pc",
      owned: false,
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

  const [bonusInput, setBonusInput] = useState(
    (formData.bonus_content || []).join(", ")
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      genre: genreInput
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      bonus_content: bonusInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      price: formData.price ? parseFloat(formData.price) : null,
    };

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/games/${initialData.id}/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/games/`;

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
              alt="Art Preview"
              className="object-contain rounded max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
            />
          </div>
        )}
      </div>
      <div className="w-full md:w-1/2 md:pl-2">
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2">
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
            name="special_title"
            placeholder="Special Title"
            value={formData.special_title || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="series"
            placeholder="Series"
            value={formData.series || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="developer"
            placeholder="Developer"
            value={formData.developer || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <select
            name="platform"
            value={formData.platform || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          >
            <option value="">-- Select Year Specificity --</option>
            <option value="pc">PC</option>
            <option value="playstation">PlayStation</option>
            <option value="xbox">Xbox</option>
            <option value="nintendo">Nintendo</option>
            <option value="mobile">Mobile</option>
            <option value="other">Unknown</option>
          </select>
          <input
            type="text"
            name="console"
            placeholder="Console / Store"
            value={formData.console || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="bonus_content"
            placeholder="Bonus Content (comma separated)"
            value={bonusInput}
            onChange={(e) => setBonusInput(e.target.value)}
            className="p-2 w-full rounded bg-neutral shadow text-sm sm:text-base"
          />
          <input
            type="date"
            name="release_date"
            placeholder="Release Date"
            value={formData.release_date || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre (comma separated)"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            className="p-2 w-full rounded bg-neutral shadow text-sm sm:text-base"
          />
          <input
            type="url"
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
            name="publisher"
            placeholder="Publisher"
            value={formData.publisher || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="url"
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
          <input
            type="date"
            name="date_bought"
            placeholder="Date Bought"
            value={formData.date_bought || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <label className="flex items-center space-x-2">
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
            className="bg-primary text-sm sm:text-base text-white px-4 py-2 rounded hover:bg-neutral-mid hover:text-background hover:scale-105 transition cursor-pointer"
          >
            {initialData ? "Update Game" : "Add Game"}
          </button>
        </form>
      </div>
    </div>
  );
}
