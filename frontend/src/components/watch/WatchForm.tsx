"use client";

import { useState, useEffect } from 'react';
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
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
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
        <div className="flex w-full">
            <div className="w-1/2 pr-2">
                {formData.photo && (
                    <div className="mb-3">
                    <p className="text-sm text-silver mb-1">Current Photo Preview:</p>
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
                        name="brand"
                        placeholder="Brand"
                        value={formData.brand || ""}
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
                        name="model"
                        placeholder="Model"
                        value={formData.model || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="reference_number"
                        placeholder="Reference Number"
                        value={formData.reference_number || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="registration_number"
                        placeholder="Registration Number"
                        value={formData.registration_number || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
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
                        name="diameter"
                        placeholder="Diameter (mm)"
                        value={formData.diameter || ""}
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
                        type="text"
                        name="movement"
                        placeholder="Movement"
                        value={formData.movement || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="winding"
                        placeholder="Winding"
                        value={formData.winding || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="complications"
                        placeholder="Complications (comma separated)"
                        value={complicationsInput}
                        onChange={(e) => setComplicationsInput(e.target.value)}
                        className="p-2 w-full rounded bg-neutral shadow"
                    />
                    <input
                        type="text"
                        name="strap"
                        placeholder="Strap"
                        value={formData.strap || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="dial"
                        placeholder="Dial"
                        value={formData.dial || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="case"
                        placeholder="Case"
                        value={formData.case || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="numerals"
                        placeholder="Numerals"
                        value={formData.numerals || ""}
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
                        onChange={handleTextAreaChange}
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
                        className="bg-primary text-white px-4 py-2 rounded hover:scale-105 transition cursor-pointer"
                    >
                        {initialData ? "Update Watch" : "Add Watch"}
                    </button>
                </form>
            </div>
        </div>
  );
}