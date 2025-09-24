"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";
import { List } from "@/types/list";

type Props = {
  onClose: () => void;
  onCreated: () => void;
  initialList?: List;
};

export default function BookListModal({ onClose, onCreated, initialList }: Props) {
  const [name, setName] = useState(initialList?.name || "");
  const [description, setDescription] = useState(initialList?.description || "");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [selected, setSelected] = useState<Book[]>(initialList?.books || []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/?search=${encodeURIComponent(search)}`);
      const data = await response.json();
      const validResults = data.filter((book: Book) => {
        if (!book.id || typeof book.id !== "number") {
          return false;
        }
        return true;
      });
      setResults(validResults);
    } catch (error) {
      alert("Error searching books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (book: Book) => {
    if (!book.id || typeof book.id !== "number") {
      return;
    }
    setSelected((prev) => {
      const newSelected = prev.find((i) => i.id === book.id)
        ? prev.filter((i) => i.id !== book.id)
        : [...prev, book];
      return newSelected;
    });
  };

  const handleSubmit = async () => {
    const bookIds = selected
      .map((b) => {
        if (!b.id || typeof b.id !== "number") {
          return null;
        }
        return b.id;
      })
      .filter((id): id is number => id !== null);

    if (bookIds.length === 0) {
      alert("No valid books selected. Please select at least one book with a valid ID.");
      return;
    }

    const payload = {
      name,
      description,
      category: "book",
      books_ids: bookIds,
    };

    const isEdit = !!initialList?.id;
    const url = isEdit ? `http://127.0.0.1:8000/api/lists/${initialList.id}/` : "http://127.0.0.1:8000/api/lists/";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (response.ok) {
        onCreated();
        onClose();
      } else {
        alert(`Failed to ${isEdit ? "update" : "create"} list: ${JSON.stringify(responseData)}`);
      }
    } catch (error) {
      alert("A network error occurred. Please try again.");
    }
  };

  const deleteList = async (id: number) => {
    if (!confirm("Are you sure you want to delete this list?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/lists/${id}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        onCreated();
        router.push("/books");
      } else {
        alert("Failed to delete list. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while deleting the list.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold font-serif mb-4">
          {initialList?.id ? "Edit Book List" : "Create Book List"}
        </h2>

        <input
          type="text"
          placeholder="List title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-sans w-full p-2 active:border border-1 border-neutral/50 rounded mb-3"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="font-sans w-full p-2 active:border border-1 border-neutral/50 rounded mb-4"
        />

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="font-sans flex-1 p-2 active:border border-1 border-neutral/50 rounded"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="font-sans bg-primary text-white px-4 py-2 rounded hover:bg-neutral-mid hover:text-background cursor-pointer"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="max-h-40 overflow-y-auto mb-4 border rounded p-2">
            {results.map((book) => (
              <div
                key={book.id}
                onClick={() => toggleSelect(book)}
                className={`font-sans flex items-center p-2 cursor-pointer hover:bg-neutral ${
                  selected.find((i) => i.id === book.id) ? "bg-primary/20" : ""
                }`}
              >
                {book.cover && (
                  <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded mr-3" />
                )}
                <span>{book.title}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4 max-h-100 overflow-y-auto">
          <h3 className="font-sans font-semibold">Selected Books</h3>
          <div className="flex flex-col items-start gap-3 mt-2">
            {selected.length > 0 ? (
              selected.map((book) => (
                <div
                  key={book.id}
                  className="font-sans flex items-center justify-between border-b-1 border-b-foreground/20 pb-4 pl-2 w-full cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    {book.cover && (
                      <img src={book.cover} alt={book.title} className="w-24 object-cover rounded" />
                    )}
                    <div className="text-md flex space-x-2 items-center mr-2 text-center">
                      <p>{book.title}</p>
                      <p className="text-gray-400">{book.year_released || "Unknown"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSelect(book)}
                    className="font-sans bg-danger px-1 mr-2 rounded-xs cursor-pointer hover:bg-danger/80"
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p className="font-sans text-gray-400">No books selected.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSubmit}
            className="font-sans bg-primary text-white px-4 py-2 rounded hover:bg-neutral-mid hover:text-background cursor-pointer"
            disabled={!name.trim() || selected.length === 0}
          >
            {initialList?.id ? "Update List" : "Create List"}
          </button>
          <button
            onClick={onClose}
            className="font-sans px-4 py-2 rounded bg-neutral-mid text-background hover:text-white cursor-pointer hover:bg-danger"
          >
            Cancel
          </button>
          {initialList?.id && (
            <button
              onClick={() => initialList.id && deleteList(initialList.id)}
              className="font-sans bg-danger text-white px-4 py-2 rounded hover:bg-danger/80 cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}