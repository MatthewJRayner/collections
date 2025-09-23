"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Film } from "@/types/film";
import { List } from "@/types/list";
import FilmCard from "@/components/film/FilmCard";
import FilmListModal from "@/components/film/FilmListModal";

export default function ListDetailPage() {
  const { id } = useParams();
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [initialListData, setInitialListData] = useState<List | null>(null);

  const fetchList = () => {
    fetch(`http://127.0.0.1:8000/api/lists/${id}/`)
        .then((res) => res.json())
        .then((data) => {
        setList(data);
        setLoading(false);
    })
        .catch((error) => {
        console.error("Error fetching list:", error);
        setLoading(false);
    });
  }
  
  useEffect(() => {
    if (!id) return;
    fetchList()
  }, []);

  if (loading) return <p className="p-6 text-gray-400">Loading...</p>;
  if (!list) return <p className="p-6 text-gray-400">List not found</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-2 items-center">
        <h1 className="text-3xl font-bold font-serif">{list.name}</h1>
        <button
            onClick={() => {
            setShowListModal(true);
            setInitialListData(list);
            }}
            className="font-sans hover:text-primary transition-all duration-300 cursor-pointer text-lg"
        >
            ✎
        </button>
      </div>
      {showListModal && (
        <FilmListModal
            onClose={() => {
                setShowListModal(false);
                setInitialListData(null);
            }}
            onCreated={() => {
                fetchList();
                setShowListModal(false);
                setInitialListData(null);
            }}
            initialList={initialListData}
        />
      )}

      {list.description && (
        <p className="font-sans text-gray-400">{list.description}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {list.films.length > 0 ? (
          list.films.map((film) => (
            <div key={film.id} className={`${film.seen ? "opacity-50" : ""}`}>
                <FilmCard key={film.id} film={film} />
            </div>
          ))
        ) : (
          <p className="font-sans text-gray-400 col-span-full text-center">
            No films in this list.
          </p>
        )}
      </div>
    </div>
  );
}