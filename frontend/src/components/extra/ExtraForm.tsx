"use client";

import { useState, useEffect } from 'react';
import { Extra } from '@/types/extra';

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
                type === 'checkbox'
                    ? (e.target instanceof HTMLInputElement ? e.target.checked : false)
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
            ? `http://127.0.0.1:8000/api/extra/${initialData.id}/`
            : "http://127.0.0.1:8000/api/extra/";

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
                {formData.photo && (
                    <div className="mb-3">
                        <p className="text-sm text-silver mb-1">Preview:</p>
                        <img
                            src={formData.photo}
                            alt="Watch preview"
                            className=" object-contain rounded"
                        />
                    </div>
                )}
            </div>
            <div className="w-1/2 pl-2">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="theme"
                        placeholder="Category"
                        value={formData.theme || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="brand"
                        placeholder="Brand"
                        value={formData.brand || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="model"
                        placeholder="Model"
                        value={formData.model || ""}
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
                        type="url"
                        name="links"
                        placeholder="Link"
                        value={formData.links || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="year"
                        placeholder="Year"
                        value={formData.year || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <select
                        name="year_specificity"
                        value={formData.year_specificity || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
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
                        {initialData ? "Update Item" : "Add Item"}
                    </button>
                </form>
            </div>
        </div>
  );
}