"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Music } from "../../../../types/music";
import MusicForm from "../../../../components/music/MusicForm";

export default function EditMusicPage() {
  const { id } = useParams();
  const router = useRouter();
  const [music, setMusic] = useState<Music | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/music/${id}/`)
      .then((res) => res.json())
      .then((data) => setMusic(data));
  }, [id]);

  if (!music) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Music Item</h1>
      <MusicForm
        initialData={music}
        onSuccess={() => {
          router.push("/music");
        }}
      />
    </div>
  );
}
