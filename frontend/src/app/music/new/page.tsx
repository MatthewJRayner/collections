"use client";

import MusicForm from "../../../components/music/MusicForm";
import { useRouter } from "next/navigation";

export default function NewMusicPage() {
    const router = useRouter();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add To Your Music Collection</h1>
        <MusicForm
          onSuccess={() => {
            router.push("/music"); // go back after saving
          }}
        />
      </div>
    );
};