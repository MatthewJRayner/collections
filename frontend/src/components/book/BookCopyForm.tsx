"use client";

import { useState, useEffect } from 'react';
import { BookCopy } from '@/types/bookCopy';

type BookCopyFormProps = {
    initialData?: BookCopy;
    onSuccess: () => void;
};

export default function BookCopyForm({ initialData, onSuccess }: BookCopyFormProps) {
    const [formData, setFormData] = useState<BookCopy>(
        initialData || {
            title: "",
            format: "hardcover",
            author: "",
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

    const [genreInput, setGenreInput] = useState(
        (formData.genre || []).join(", ")
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            genre: genreInput
                .split(",")
                .map((g) => g.trim())
                .filter(Boolean),
            price: formData.price ? parseFloat(formData.price): null,
        };

        const method = initialData ? "PUT" : "POST";
        const url = initialData
            ? `http://127.0.0.1:8000/api/book-collecitons/${initialData.id}/`
            : "http://127.0.0.1:8000/api/book-collecitons/";

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
                {formData.cover_image && (
                    <div className="mb-3">
                        <p className="text-sm text-silver mb-1">Current Cover Preview:</p>
                        <img
                            src={formData.cover_image}
                            alt="Cover preview"
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
                        name="author"
                        placeholder="Author"
                        value={formData.author || ""}
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
                        <option value="hardcover">Hardcover</option>
                        <option value="paperback">Paperback</option>
                        <option value="ebook">EBook</option>
                        <option value="audiobook">Audiobook</option>
                        <option value="other">Other</option>
                    </select>
                    <input
                        type="date"
                        name="publication_date"
                        placeholder="Publication Date (Jan 01 if unknown)"
                        value={formData.publication_date || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded"
                    />
                    <input
                        type="url"
                        name="cover_image"
                        placeholder="Cover Image"
                        value={formData.cover_image || ""}
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
                        name="price"
                        placeholder="Price"
                        value={formData.price || ""}
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
                        type="text"
                        name="isbn"
                        placeholder="ISBM"
                        value={formData.isbn || ""}
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
                        name="language"
                        placeholder="Language"
                        value={formData.language || ""}
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
                        name="printing"
                        placeholder="Printing"
                        value={formData.printing || ""}
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
                        {initialData ? "Update Book Collection" : "Add Book"}
                    </button>
                </form>
            </div>
        </div>
  );
}