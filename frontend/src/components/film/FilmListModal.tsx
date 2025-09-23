"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film } from "@/types/film";
import { List } from "@/types/list";

type Props = {
  onClose: () => void;
  onCreated: () => void;
  initialList?: List;
};

export default function FilmListModal({ onClose, onCreated, initialList }: Props) {
  const [name, setName] = useState(initialList?.name || "");
  const [description, setDescription] = useState(initialList?.description || "");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Film[]>([]);
  const [selected, setSelected] = useState<Film[]>(initialList?.films || []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const response = await fetch(`http://127.0.0.1:8000/api/films/?search=${encodeURIComponent(search)}`);
    const data = await response.json();
    setResults(data);
    setLoading(false);
  };

  const toggleSelect = (film: Film) => {
    if (selected.find((i) => i.id === film.id)) {
      setSelected(selected.filter((i) => i.id !== film.id));
    } else {
      setSelected([...selected, film]);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      description,
      category: "film",
      films: selected.map((f) => f.id),
    };

    const isEdit = !!initialList?.id;
    const url = isEdit ? `http://127.0.0.1:8000/api/lists/${initialList.id}/` : "http://127.0.0.1:8000/api/lists/";
    const method = isEdit ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      onCreated();
      onClose();
    } else {
      console.error(`Error ${isEdit ? "updating" : "creating"} list`, await response.json());
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
        onCreated(); // Trigger parent refresh
        router.push("/films"); // Redirect to /films
      } else {
        console.error("Error deleting list:", await response.json());
        alert("Failed to delete list. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("An error occurred while deleting the list.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold font-serif mb-4">
          {initialList?.id ? "Edit Film List" : "Create Film List"}
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

        {/* Search */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Search films..."
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

        {/* Search Results */}
        {results.length > 0 && (
          <div className="max-h-40 overflow-y-auto mb-4 border rounded p-2">
            {results.map((film) => (
              <div
                key={film.id}
                onClick={() => toggleSelect(film)}
                className={`font-sans flex items-center p-2 cursor-pointer hover:bg-neutral ${
                  selected.find((i) => i.id === film.id) ? "bg-primary/20" : ""
                }`}
              >
                {film.poster && (
                  <img src={film.poster} alt={film.title} className="w-10 h-14 object-cover rounded mr-3" />
                )}
                <span>{film.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Selected Films */}
        <div className="mb-4 max-h-100 overflow-y-auto">
          <h3 className="font-sans font-semibold">Selected Films</h3>
          <div className="flex flex-col items-start gap-3 mt-2">
            {selected.length > 0 ? (
              selected.map((film) => (
                <div
                  key={film.id}
                  className="font-sans flex items-center justify-between border-b-1 border-b-foreground/20 pb-4 pl-2 w-full cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    {film.poster && (
                      <img src={film.poster} alt={film.title} className="w-24 object-cover rounded" />
                    )}
                    <div className="text-md flex space-x-2 items-center mr-2 text-center">
                      <p>{film.title}</p>
                      <p className="text-gray-400">{film.release_date?.substring(0, 4) || "Unknown"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSelect(film)}
                    className="font-sans bg-danger px-1 mr-2 rounded-xs cursor-pointer hover:bg-danger/80"
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p className="font-sans text-gray-400">No films selected.</p>
            )}
          </div>
        </div>

        {/* Actions */}
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