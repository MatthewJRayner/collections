"use client";

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';

type BookFormProps = {
    initialData?: Book;
    onSuccess: () => void;
};

export default function BookForm({ initialData, onSuccess }: BookFormProps) {
    const [formData, setFormData] = useState<Book>(
        initialData || {
            title: "",
            author: "",
            year_specificity: undefined,
            read: false,
            favourite: false,
            readlist: false,
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
            rating: formData.rating ? parseFloat(formData.rating): null,
            industry_rating: formData.industry_rating ? parseFloat(formData.industry_rating): null,
            volume: formData.volume ? parseFloat(formData.volume): null,
            year_released: formData.year_released ? parseFloat(formData.year_released): null,
            page_count: formData.page_count ? parseFloat(formData.page_count): null,
            edition_read_year: formData.edition_read_year ? parseFloat(formData.edition_read_year): null,
        };

        const method = initialData ? "PUT": "POST";
        const url = initialData
            ? `http://127.0.0.1:8000/api/books/${initialData.id}/`
            : "http://127.0.0.1:8000/api/books/";

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
                {formData.cover && (
                    <div className='mb-3'>
                        <p className="text-sm text-silver mb-1">Current Cover Preview:</p>
                        <img
                            src={formData.cover}
                            alt="Cover Preview"
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
                        name="author"
                        placeholder="Author"
                        value={formData.author || ""}
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
                        placeholder="Industry Rating (GoodReads or something)"
                        value={formData.industry_rating || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="format"
                        placeholder="Format"
                        value={formData.format || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    
                    <input
                        type="text"
                        name="page_count"
                        placeholder="Page Count"
                        value={formData.page_count || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="date"
                        name="date_published"
                        placeholder="Date Published (if known)"
                        value={formData.date_published || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="year_released"
                        placeholder="Year Published"
                        value={formData.year_released || ""}
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
                        name="og_language"
                        placeholder="Original Language"
                        value={formData.og_language || ""}
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
                        type="url"
                        name="cover"
                        placeholder="Cover"
                        value={formData.cover || ""}
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
                        name="ISBN"
                        placeholder="ISBN"
                        value={formData.ISBN || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="publisher"
                        placeholder="Publisher"
                        value={formData.publisher || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="edition"
                        placeholder="Edition"
                        value={formData.edition || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="text"
                        name="edition_read_year"
                        placeholder="Year of the Edition Read"
                        value={formData.edition_read_year || ""}
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
                        name="read"
                        checked={formData.read}
                        onChange={handleChange}
                        />
                        <span>Read</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        name="readlist"
                        checked={formData.readlist}
                        onChange={handleChange}
                        />
                        <span>Readlist</span>
                    </label>
                    <input
                        type="date"
                        name="date_read"
                        placeholder="Date Read"
                        value={formData.date_read || ""}
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