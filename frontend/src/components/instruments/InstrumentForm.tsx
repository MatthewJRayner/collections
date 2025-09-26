"use client";

import { useState } from "react";
import { Instrument } from "@/types/instrument";

type InstrumentFormProps = {
  initialData?: Instrument;
  onSuccess: () => void;
};

export default function InstrumentForm({
  initialData,
  onSuccess,
}: InstrumentFormProps) {
  const [formData, setFormData] = useState<Instrument>(
    initialData || {
      instrument: "",
      name: "",
      owned: false,
      category: "string",
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
      year: formData.year ? parseInt(formData.year.toString(), 10) : null,
    };

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/instruments/${initialData.id}/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/instruments/`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    onSuccess();
  };

  return (
    <div className="flex flex-col md:flex-row w-full p-6 sm:p-6">
      <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
        {formData.photo && (
          <div className="mb-3 flex flex-col items-center">
            <p className="text-xs sm:text-sm text-silver mb-1 w-full text-left">
              Preview:
            </p>
            <img
              src={formData.photo}
              alt="Instrument preview"
              className="object-contain rounded max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
            />
          </div>
        )}
      </div>
      <div className="w-full md:w-1/2 md:pl-2">
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          <input
            type="text"
            name="instrument"
            placeholder="Instrument"
            value={formData.instrument || ""}
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
            name="name"
            placeholder="Model"
            value={formData.name || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={formData.type || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="maker"
            placeholder="Maker"
            value={formData.maker || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          >
            <option value="">-- Select Category --</option>
            <option value="string">Strings</option>
            <option value="keyboard">Keyboard</option>
            <option value="percussion">Percussion</option>
            <option value="wind">Wind</option>
            <option value="brass">Brass</option>
            <option value="electronic">Electronic</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
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
            {initialData ? "Update Instrument" : "Add Instrument"}
          </button>
        </form>
      </div>
    </div>
  );
}
