"use client";

import FilmMediaForm from "../../../../components/film/FilmMediaForm"
import { useRouter } from "next/navigation";

export default function NewFilmMediaPage() {
    const router = useRouter();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add To Your Film Collection</h1>
        <FilmMediaForm
          onSuccess={() => {
            router.push("/films/collections"); // go back after saving
          }}
        />
      </div>
    );
};