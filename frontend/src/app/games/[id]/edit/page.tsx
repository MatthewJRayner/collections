"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Game } from "@/types/game";
import GameForm from "@/components/games/GameForm";

export default function EditGamePage() {
    const { id } = useParams();
    const router = useRouter();
    const [game, setGame] = useState<Game | null>(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/games/${id}/`)
            .then((res) => res.json())
            .then((data) => setGame(data));
    }, [id]);

    if (!game) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Game</h1>
            <GameForm
            initialData={game}
            onSuccess={() => {
                router.push("/games");
            }}
            />
        </div>
    );
}