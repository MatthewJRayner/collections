"use client";

import { useState, useEffect } from 'react';
import { FilmPhysical } from '@/types/filmMedia';

type FilmMediaFormProps = {
    initialData?: FilmPhysical;
    onSuccess: () => void;
};

export default function FilmMediaForm({ initialData, onSuccess }: FilmMediaFormProps) {
    const [formData, setFormData] = useState<FilmPhysical>(
        initialData || {
            title: "",
            format: "dvd",
            type: "movie",
            owned: false,
            genre: [],
            special_features: false,
            features: []
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

    const [genreInput, setGenreInput] = useState(
        (formData.genre || []).join(", ")
    );

    const [featuresInput, setFeaturesInput] = useState(
        (formData.features || []).join(", ")
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            genre: genreInput
                .split(",")
                .map((g) => g.trim())
                .filter(Boolean),
            runtime: formData.runtime 
                ? (formData.runtime.length === 5
                    ? formData.runtime + ":00"
                    : formData.runtime)
                : null,
            price: formData.price ? parseFloat(formData.price): null,
            release_year: formData.release_year ? parseFloat(formData.release_year): null,
        };

        const method = initialData ? "PUT" : "POST";
        const url = initialData
            ? `http://127.0.0.1:8000/api/film-collections/${initialData.id}/`
            : "http://127.0.0.1:8000/api/film-collections/";

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
                {formData.cover_art && (
                    <div className="mb-3">
                        <p className="text-sm text-silver mb-1">Current Cover Art Preview:</p>
                        <img
                            src={formData.cover_art}
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
                        name="title"
                        placeholder="Title"
                        value={formData.title || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="director"
                        placeholder="Director"
                        value={formData.director || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <select
                        name="format"
                        value={formData.format || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    >
                        <option value="">-- Select Format --</option>
                        <option value="dvd">DVD</option>
                        <option value="blu-ray">BluRay</option>
                        <option value="4k">4k UHD</option>
                        <option value="vhs">VHS</option>
                        <option value="laserdisc">Laserdisc</option>
                        <option value="betamax">Betamax</option>
                        <option value="film">Film</option>
                        <option value="digital">Digital</option>
                        <option value="other">Other</option>
                    </select>
                    <select
                        name="type"
                        value={formData.type || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    >
                        <option value="">-- Select Type --</option>
                        <option value="movie">Movie</option>
                        <option value="series">Series</option>
                        <option value="documentary">Documentary</option>
                        <option value="short">Short</option>
                        <option value="other">Other</option>
                    </select>
                    <input
                        type="text"
                        name="release_year"
                        placeholder="Release Year"
                        value={formData.release_year || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="url"
                        name="cover_art"
                        placeholder="Cover Art"
                        value={formData.cover_art || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="genre"
                        placeholder="Genres (comma separated)"
                        value={genreInput}
                        onChange={(e) => setGenreInput(e.target.value)}
                        className="p-2 w-full rounded bg-neutral shadow"
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
                        name="language"
                        placeholder="Language"
                        value={formData.language || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="number"
                        name="studio"
                        placeholder="Distributor"
                        value={formData.studio || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="time"
                        step="1"
                        name="runtime"
                        placeholder="Runtime"
                        value={formData.runtime || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="url"
                        name="link"
                        placeholder="Link"
                        value={formData.link || ""}
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
                        name="special_features"
                        checked={formData.special_features}
                        onChange={handleChange}
                        />
                        <span>Special Features</span>
                    </label>
                    <input
                        type="text"
                        name="features"
                        placeholder="Features (comma separated)"
                        value={featuresInput}
                        onChange={(e) => setFeaturesInput(e.target.value)}
                        className="p-2 w-full rounded bg-neutral shadow"
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
                        {initialData ? "Update Film Collection" : "Add Film"}
                    </button>
                </form>
            </div>
        </div>
  );
}