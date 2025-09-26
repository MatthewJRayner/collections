"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Film } from "../../../../types/film";
import FilmForm from "../../../../components/film/FilmForm";
import Link from "next/link";

export default function EditFilmsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [film, setFilms] = useState<Film | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/films/${id}/`)
      .then((res) => res.json())
      .then((data) => setFilms(data));
  }, [id]);

  if (!film) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <div className="flex items-center w-full space-x-2">
        <h1 className="text-xl sm:text-2xl font-bold">Edit Film</h1>
        <Link
          href={`/films/${id}`}
          className="text-sm font-semibold transition-all duration-300 hover:scale-105 hover:text-danger active:scale-90"
        >
          ⏴Back
        </Link>
      </div>
      <FilmForm
        initialData={film}
        onSuccess={() => {
          router.push(`/films`);
        }}
      />
    </div>
  );
}
