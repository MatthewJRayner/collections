"use client";

import FilmForm from "@/components/film/FilmForm";
import { useRouter } from "next/navigation";

export default function NewFilmPage() {
    const router = useRouter();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Track A New Film</h1>
            <FilmForm 
                onSuccess={() => {
                    router.push("/films");
                }}
            />
        </div>
    );
};