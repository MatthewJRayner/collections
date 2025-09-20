"use client";

import { useState, useEffect } from 'react';
import { Instrument } from '@/types/instrument';

type InstrumentFormProps = {
    initialData?: Instrument;
    onSuccess: () => void;
};

export default function InstrumentForm({ initialData, onSuccess }: InstrumentFormProps) {
    const [formData, setFormData] = useState<Instrument>(
        initialData || {
            instrument: "",
            name: "",
            owned: false,
            category: "string"
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
            year: formData.year ? parseInt(formData.year.toString(), 10) : null,  
        };

        const method = initialData ? "PUT" : "POST";
        const url = initialData
            ? `http://127.0.0.1:8000/api/instruments/${initialData.id}/`
            : "http://127.0.0.1:8000/api/instruments/";

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
                            alt="Instrument preview"
                            className=" object-contain rounded"
                        />
                    </div>
                )}
            </div>
            <div className="w-1/2 pl-2">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="instrument"
                        placeholder="Instrument"
                        value={formData.instrument || ""}
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
                        name="name"
                        placeholder="Model"
                        value={formData.name || ""}
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
                        name="maker"
                        placeholder="Maker"
                        value={formData.maker || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <select
                        name="category"
                        value={formData.category || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
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
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="number"
                        name="year"
                        placeholder="Year"
                        value={formData.year || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
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
                        {initialData ? "Update Instrument" : "Add Instrument"}
                    </button>
                </form>
            </div>
        </div>
  );
}