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
        fetch(`http://127.0.0.1:8000/api/music/${id}/`)
            .then((res) => res.json())
            .then((data) => setMusic(data));
    }, [id]);

    if (!music) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Music Item</h1>
            <MusicForm
            initialData={music}
            onSuccess={() => {
                router.push("/music");
            }}
            />
        </div>
    );
}