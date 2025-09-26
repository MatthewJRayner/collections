"use client";

import MusicForm from "../../../components/music/MusicForm";
import { useRouter } from "next/navigation";

export default function NewMusicPage() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        Add To Your Music Collection
      </h1>
      <MusicForm
        onSuccess={() => {
          router.push("/music"); // go back after saving
        }}
      />
    </div>
  );
}
