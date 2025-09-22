"use client";

import { useState, useEffect } from 'react';
import { Film } from "../../types/film";
import CastEditor from './CastEditor';
import CrewEditor from './CrewEditor';
import AwardsEditor from './AwardsEditor';
import BatchImportModal from './BatchImportModal';

type FilmFormProps = {
    initialData?: Film;
    onSuccess: () => void;
};

export default function FilmForm({ initialData, onSuccess }: FilmFormProps) {
    const [formData, setFormData] = useState<Film>(
        initialData || {
            title: "",
            director: "",
            genre: [],
            tags: [],
            sound: true,
            colour: true,
            favourite: false,
            seen: false,
            watchlist: false
        }
    );
    const [showBatchModal, setShowBatchModal] = useState(false);

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

    const [tagsInput, setTagsInput] = useState(
        (formData.tags || []).join(", ")
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            genre: genreInput
                .split(",")
                .map((g) => g.trim())
                .filter(Boolean),
            tags: tagsInput
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            runtime: formData.runtime
                ? (formData.runtime.length === 5
                    ? formData.runtime + ":00"
                    : formData.runtime)
                : null,
            rating: formData.rating ? parseFloat(formData.rating): null,
            industry_rating: formData.industry_rating ? parseFloat(formData.industry_rating): null,
            volume: formData.volume ? parseFloat(formData.volume): null,
            budget: formData.budget ? parseFloat(formData.budget): null,
            box_office: formData.box_office ? parseFloat(formData.box_office): null,
        };

        const method = initialData ? "PUT": "POST";
        const url = initialData
            ? `http://127.0.0.1:8000/api/films/${initialData.id}/`
            : "http://127.0.0.1:8000/api/films/";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        onSuccess();
    };

    return (
        <div className='flex w-full'>
            <div className='w-1/2 pr-2 flex flex-col'>
                {formData.poster && (
                    <div className='mb-3'>
                        <p className="text-sm text-silver mb-1">Current Poster Preview:</p>
                        <img
                            src={formData.poster}
                            alt="Poster Preview"
                            className=" object-contain rounded"
                        />
                    </div>
                )}
                {formData.background_pic && (
                    <div className='mb-3'>
                        <p className="text-sm text-silver mb-1">Current Background Preview:</p>
                        <img
                            src={formData.background_pic}
                            alt="Background Preview"
                            className=" object-contain rounded"
                        />
                    </div>
                )}
            </div>
            <div className='w-1/2 pl-2'>
                <form onSubmit={handleSubmit} className='space-y-3'>
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
                        name="alt_title"
                        placeholder="Alternative Title"
                        value={formData.alt_title || ""}
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
                    <input
                        type="text"
                        name="alt_name"
                        placeholder="Original Name"
                        value={formData.alt_name || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="rating"
                        placeholder="Rating"
                        value={formData.rating || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="industry_rating"
                        placeholder="Industry Rating (IMDb or something)"
                        value={formData.industry_rating || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <CastEditor 
                        castlist={formData.cast || []}
                        setCastlist={(c) => setFormData({ ...formData, cast: c })}
                    />
                    <CrewEditor 
                        crewlist={formData.crew || []}
                        setCrewlist={(c) => setFormData({ ...formData, crew: c })}
                    />
                    <input
                        type="date"
                        name="release_date"
                        placeholder="Release Date"
                        value={formData.release_date || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="series"
                        placeholder="Series"
                        value={formData.series || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="volume"
                        placeholder="Volume"
                        value={formData.volume || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="language"
                        placeholder="Language"
                        value={formData.language || ""}
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
                        type="text"
                        name="festival"
                        placeholder="Festival"
                        value={formData.festival || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="poster"
                        placeholder="Poster"
                        value={formData.poster || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="background_pic"
                        placeholder="Background Picture"
                        value={formData.background_pic || ""}
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
                        type="text"
                        name="genre"
                        placeholder="Genres (comma separated)"
                        value={genreInput}
                        onChange={(e) => setGenreInput(e.target.value)}
                        className="p-2 w-full rounded bg-neutral shadow"
                    />
                    <input
                        type="text"
                        name="tags"
                        placeholder="Tags (comma separated)"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="p-2 w-full rounded bg-neutral shadow"
                    />
                    <input
                        type="text"
                        name="medium"
                        placeholder="Medium"
                        value={formData.medium || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <label className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        name="sound"
                        checked={formData.sound}
                        onChange={handleChange}
                        />
                        <span>Sound</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        name="colour"
                        checked={formData.colour}
                        onChange={handleChange}
                        />
                        <span>Colour</span>
                    </label>
                    <input
                        type="text"
                        name="budget"
                        placeholder="Budget ($)"
                        value={formData.budget || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="box_office"
                        placeholder="Box Office ($)"
                        value={formData.box_office || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <AwardsEditor 
                        awards={formData.awards_won || []}
                        setAwards={(a) => setFormData({ ...formData, awards_won: a})}
                    />
                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={formData.notes || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <textarea
                        name="blurb"
                        placeholder="Blurb"
                        value={formData.blurb || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <textarea
                        name="synopsis"
                        placeholder="Synopsis"
                        value={formData.synopsis || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="external_links"
                        placeholder="External Link"
                        value={formData.external_links || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <label className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        name="seen"
                        checked={formData.seen}
                        onChange={handleChange}
                        />
                        <span>Seen</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        name="watchlist"
                        checked={formData.watchlist}
                        onChange={handleChange}
                        />
                        <span>Watchlist</span>
                    </label>
                    <input
                        type="date"
                        name="date_watched"
                        placeholder="Date Watched"
                        value={formData.date_watched || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <label className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        name="favourite"
                        checked={formData.favourite}
                        onChange={handleChange}
                        />
                        <span>Favourite</span>
                    </label>
                    <textarea
                        name="review"
                        placeholder="Review"
                        value={formData.review || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
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
};