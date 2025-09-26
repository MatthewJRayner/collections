"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FilmPhysical } from "@/types/filmMedia";
import FilmMediaForm from "@/components/film/FilmMediaForm";

export default function EditWatchPage() {
    const { id } = useParams();
    const router = useRouter();
    const [filmMedia, setFilmMedia] = useState<FilmPhysical | null>(null);

    useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/film-collections/${id}/`)
        .then((res) => res.json())
        .then((data) => setFilmMedia(data));
    }, [id]);

    if (!filmMedia) return <p className="p-6">Loading...</p>;

    return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Film</h1>
        <FilmMediaForm
        initialData={filmMedia}
        onSuccess={() => {
            router.push("/films/collections");
        }}
        />
    </div>
    );
}