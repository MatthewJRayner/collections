"use client";

import { useState } from "react";
import { Clothing } from "@/types/clothing";

type ClothesFormProps = {
  initialData?: Clothing;
  onSuccess: () => void;
};

export default function ClothesForm({
  initialData,
  onSuccess,
}: ClothesFormProps) {
  const [formData, setFormData] = useState<Clothing>(
    initialData || {
      category: "shirts",
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

  const [featuresInput, setFeaturesInput] = useState(
    (formData.features || []).join(", ")
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      features: featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      price: formData.price ? parseFloat(formData.price) : null,
      preferred_quantity: formData.preferred_quantity
        ? parseFloat(formData.preferred_quantity)
        : null,
    };

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `http://127.0.0.1:8000/api/wardrobe/${initialData.id}/`
      : "http://127.0.0.1:8000/api/wardrobe/";

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
        {formData.pictures && (
          <div className="mb-3 flex flex-col items-center">
            <p className="text-xs sm:text-sm text-silver mb-1 w-full text-left">Preview:</p>
            <img
              src={formData.pictures}
              alt="Watch preview"
              className="object-contain rounded max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
            />
          </div>
        )}
      </div>
      <div className="w-full md:w-1/2 md:pl-2">
        <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
          <select
            name="Category"
            value={formData.category || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          >
            <option value="">-- Select Category --</option>
            <option value="shirts">Shirts</option>
            <option value="trousers">Trousers</option>
            <option value="suits">Suits</option>
            <option value="coats_jackets">Coats & Jackets</option>
            <option value="shoes">Shoes</option>
            <option value="neckwear">Neckwear</option>
            <option value="knitwear">Knitwear</option>
            <option value="hosiery">Hosiery</option>
            <option value="underpinnings">Underpinnings</option>
            <option value="shirts_accessories">Shirts & Accessories</option>
            <option value="leather_goods">Leather Goods</option>
            <option value="hats">Hats</option>
            <option value="tools_essentials">
              Gentleman&apos;s Tools & Essentials
            </option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="brands"
            placeholder="Brand"
            value={formData.brands || ""}
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
            name="style"
            placeholder="Style"
            value={formData.style || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="material"
            placeholder="Material"
            value={formData.material || ""}
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
            name="colour"
            placeholder="Colour"
            value={formData.colour || ""}
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
            name="preferred_quantity"
            placeholder="Preferred Quantity"
            value={formData.preferred_quantity || ""}
            onChange={handleChange}
            className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
          />
          <input
            type="text"
            name="features"
            placeholder="Features (comma separated)"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            className="p-2 w-full rounded bg-neutral shadow text-sm sm:text-base"
          />
          <input
            type="url"
            name="pictures"
            placeholder="Photo URL"
            value={formData.pictures || ""}
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
            {initialData ? "Update Wardrobe" : "Add Wardrobe Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
