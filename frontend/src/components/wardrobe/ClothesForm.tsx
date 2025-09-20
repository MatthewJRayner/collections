"use client";

import { useState, useEffect } from 'react';
import { Clothing } from '@/types/clothing';

type ClothesFormProps = {
    initialData?: Clothing;
    onSuccess: () => void;
};

export default function ClothesForm({ initialData, onSuccess }: ClothesFormProps) {
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
                type === 'checkbox'
                    ? (e.target instanceof HTMLInputElement ? e.target.checked : false)
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
            preferred_quantity: formData.preferred_quantity ? parseFloat(formData.preferred_quantity) : null, 
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
        <div className="flex w-full">
            <div className="w-1/2 pr-2">
                {formData.pictures && (
                    <div className="mb-3">
                        <p className="text-sm text-silver mb-1">Preview:</p>
                        <img
                            src={formData.pictures}
                            alt="Watch preview"
                            className=" object-contain rounded"
                        />
                    </div>
                )}
            </div>
            <div className="w-1/2 pl-2">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <select
                        name="Category"
                        value={formData.category || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
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
                        <option value="tools_essentials">Gentleman&apos;s Tools & Essentials</option>
                        <option value="other">Other</option>
                    </select>
                    <input
                        type="text"
                        name="brands"
                        placeholder="Brand"
                        value={formData.brands || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Type"
                        value={formData.type || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="style"
                        placeholder="Style"
                        value={formData.style || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="material"
                        placeholder="Material"
                        value={formData.material || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="collection"
                        placeholder="Collection"
                        value={formData.collection || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="colour"
                        placeholder="Colour"
                        value={formData.colour || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="price"
                        placeholder="Price"
                        value={formData.price || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="preferred_quantity"
                        placeholder="Preferred Quantity"
                        value={formData.preferred_quantity || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="features"
                        placeholder="Features (comma separated)"
                        value={featuresInput}
                        onChange={(e) => setFeaturesInput(e.target.value)}
                        className="p-2 w-full rounded bg-neutral shadow"
                    />
                    <input
                        type="url"
                        name="pictures"
                        placeholder="Photo URL"
                        value={formData.pictures || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={formData.notes || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="date"
                        name="date_bought"
                        placeholder="Date Bought"
                        value={formData.date_bought || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
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
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-neutral-mid hover:text-background hover:scale-105 transition cursor-pointer"
                    >
                        {initialData ? "Update Wardrobe" : "Add Wardrobe Item"}
                    </button>
                </form>
            </div>
        </div>
  );
}