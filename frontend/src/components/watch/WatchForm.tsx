"use client";

import { useState, useEffect } from "react";
import { Watch } from "../../types/watch";

type WatchFormProps = {
  initialData?: Watch;
  onSuccess: () => void;
};

export default function WatchForm({ initialData, onSuccess }: WatchFormProps) {
  const [formData, setFormData] = useState<Watch>(
    initialData || {
      brand: "",
      model: "",
      owned: false,
      complications: [],
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

  const [complicationsInput, setComplicationsInput] = useState(
    (formData.complications || []).join(", ")
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      complications: complicationsInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      diameter: formData.diameter ? parseFloat(formData.diameter) : null,
      price: formData.price ? parseFloat(formData.price) : null,
      year: formData.year ? parseInt(formData.year.toString(), 10) : null,
    };

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `http://127.0.0.1:8000/api/watches/${initialData.id}/`
      : "http://127.0.0.1:8000/api/watches/";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    onSuccess();
  };

  return (
    <div className="flex flex-col md:flex-row p-4 sm:p-6 w-full">
      <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
        {formData.photo && (
          <div className="mb-3 flex flex-col items-center">
            <p className="text-xs sm:text-sm text-left w-full text-silver mb-1">
              Current Photo Preview:
            </p>
            <img
              src={formData.photo}
              alt="Watch preview"
              className=" object-contain rounded max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
            />
          </div>
        )}
      </div>
      <div className="w-full md:w-1/2 md:pl-2">
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
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
            name="collection"
            placeholder="Collection"
            value={formData.collection || ""}
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
            name="reference_number"
            placeholder="Reference Number"
            value={formData.reference_number || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="registration_number"
            placeholder="Registration Number"
            value={formData.registration_number || ""}
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
            type="number"
            name="diameter"
            placeholder="Diameter (mm)"
            value={formData.diameter || ""}
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
            type="text"
            name="movement"
            placeholder="Movement"
            value={formData.movement || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="winding"
            placeholder="Winding"
            value={formData.winding || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="complications"
            placeholder="Complications (comma separated)"
            value={complicationsInput}
            onChange={(e) => setComplicationsInput(e.target.value)}
            className="p-2 w-full rounded bg-neutral shadow text-sm sm:text-base"
          />
          <input
            type="text"
            name="strap"
            placeholder="Strap"
            value={formData.strap || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="dial"
            placeholder="Dial"
            value={formData.dial || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="case"
            placeholder="Case"
            value={formData.case || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="numerals"
            placeholder="Numerals"
            value={formData.numerals || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="url"
            name="link"
            placeholder="Link"
            value={formData.link || ""}
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
            {initialData ? "Update Watch" : "Add Watch"}
          </button>
        </form>
      </div>
    </div>
  );
}
