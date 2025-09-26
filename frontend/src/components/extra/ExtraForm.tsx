"use client";

import { useState } from "react";
import { Extra } from "@/types/extra";

type ExtraFormProps = {
  initialData?: Extra;
  onSuccess: () => void;
};

export default function ExtraForm({ initialData, onSuccess }: ExtraFormProps) {
  const [formData, setFormData] = useState<Extra>(
    initialData || {
      theme: "",
      model: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      year: formData.year ? parseFloat(formData.year) : null,
    };

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/extra/${initialData.id}/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/extra/`;

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
        {formData.photo && (
          <div className="mb-3 flex flex-col items-center">
            <p className="text-xs sm:text-sm text-silver mb-1 w-full text-left">
              Preview:
            </p>
            <img
              src={formData.photo}
              alt="Preview"
              className="object-contain rounded max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
            />
          </div>
        )}
      </div>
      <div className="w-full md:w-1/2 md:pl-2">
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          <input
            type="text"
            name="theme"
            placeholder="Category"
            value={formData.theme || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model || ""}
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
            type="url"
            name="links"
            placeholder="Link"
            value={formData.links || ""}
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
            <option value="millenium">Millenium</option>
            <option value="unknown">Unknown</option>
          </select>
          <input
            type="url"
            name="photo"
            placeholder="Photo URL"
            value={formData.photo || ""}
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
            className="bg-primary text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-neutral-mid hover:text-background hover:scale-105 transition cursor-pointer"
          >
            {initialData ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
