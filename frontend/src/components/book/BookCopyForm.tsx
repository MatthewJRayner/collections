"use client";

import { useState } from 'react';
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
        <div className="flex flex-col md:flex-row w-full p-4 sm:p-6">
            <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
                {formData.cover_image && (
                    <div className="mb-3 flex flex-col items-center">
                        <p className="text-xs sm:text-sm text-silver mb-1 w-full text-left">Current Cover Preview:</p>
                        <img
                            src={formData.cover_image}
                            alt="Cover preview"
                            className="object-contain rounded max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
                        />
                    </div>
                )}
            </div>
            <div className="w-full md:w-1/2 md:pl-2">
                <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={formData.author || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <select
                        name="format"
                        value={formData.format || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
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
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <input
                        type="url"
                        name="cover_image"
                        placeholder="Cover Image"
                        value={formData.cover_image || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <input
                        type="text"
                        name="genre"
                        placeholder="Genres (comma separated)"
                        value={genreInput}
                        onChange={(e) => setGenreInput(e.target.value)}
                        className="p-2 w-full rounded text-sm sm:text-base bg-neutral shadow"
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
                        name="page_count"
                        placeholder="Page Count"
                        value={formData.page_count || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <input
                        type="text"
                        name="isbn"
                        placeholder="ISBM"
                        value={formData.isbn || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <input
                        type="text"
                        name="language"
                        placeholder="Language"
                        value={formData.language || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <input
                        type="text"
                        name="publisher"
                        placeholder="Publisher"
                        value={formData.publisher || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <input
                        type="text"
                        name="edition"
                        placeholder="Edition"
                        value={formData.edition || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    
                    <input
                        type="text"
                        name="printing"
                        placeholder="Printing"
                        value={formData.printing || ""}
                        onChange={handleChange}
                        className="bg-neutral shadow p-2 w-full rounded text-sm sm:text-base"
                    />
                    <input
                        type="url"
                        name="link"
                        placeholder="Link"
                        value={formData.link || ""}
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
                        className="bg-primary text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-neutral-mid hover:text-background hover:scale-105 transition cursor-pointer"
                    >
                        {initialData ? "Update Book Collection" : "Add Book"}
                    </button>
                </form>
            </div>
        </div>
  );
}