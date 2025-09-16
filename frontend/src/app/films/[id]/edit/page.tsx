"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Film } from "../../../../types/film";
import FilmForm from "../../../../components/film/FilmForm";

export default function EditFilmsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [film, setFilms] = useState<Film | null>(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/films/${id}/`)
            .then((res) => res.json())
            .then((data) => setFilms(data))
    }, [id]);

    if (!film) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Film</h1>
            <FilmForm
                initialData={film}
                onSuccess={() => {
                    router.push("/films");
                }}
            />
        </div>    
    )
}