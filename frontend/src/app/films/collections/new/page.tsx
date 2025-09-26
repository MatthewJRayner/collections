"use client";

import FilmMediaForm from "../../../../components/film/FilmMediaForm"
import { useRouter } from "next/navigation";

export default function NewFilmMediaPage() {
    const router = useRouter();

    return (
      <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Add To Your Film Collection</h1>
        <FilmMediaForm
          onSuccess={() => {
            router.push("/films/collections"); // go back after saving
          }}
        />
      </div>
    );
};