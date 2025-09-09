"use client";

import { useState, useEffect } from 'react';
import { Watch } from "../types/watch";

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
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            diameter: formData.diameter ? parseFloat(formData.diameter) : null,
            price: formData.price ? parseFloat(formData.price) : null,
            year: formData.year ? parseInt(formData.year.toString(), 10) : null,
        }

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
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="reference_number"
                placeholder="Reference Number"
                value={formData.reference_number || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="registration_number"
                placeholder="Registration Number"
                value={formData.registration_number || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="number"
                name="diameter"
                placeholder="Diameter (mm)"
                value={formData.diameter || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="number"
                name="year"
                placeholder="Year"
                value={formData.year || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="movement"
                placeholder="Movement"
                value={formData.movement || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="winding"
                placeholder="Winding"
                value={formData.winding || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="complications"
                placeholder="Complications (comma separated)"
                value={(formData.complications || []).join(", ")}
                onChange={(e) =>
                    setFormData({
                    ...formData,
                    complications: e.target.value
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean),
                    })
                }
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="strap"
                placeholder="Strap"
                value={formData.strap || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="dial"
                placeholder="Dial"
                value={formData.dial || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="case"
                placeholder="Case"
                value={formData.case || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="text"
                name="numerals"
                placeholder="Numerals"
                value={formData.numerals || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="url"
                name="photo"
                placeholder="Photo URL"
                value={formData.photo || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="url"
                name="link"
                placeholder="External Link"
                value={formData.link || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {initialData ? "Update Watch" : "Add Watch"}
            </button>
        </form>
  );
}