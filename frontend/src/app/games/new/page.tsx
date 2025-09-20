"use client";

import GameForm from "@/components/games/GameForm";
import { useRouter } from "next/navigation";

export default function NewGamePage() {
    const router = useRouter();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add To Your Games Collection</h1>
        <GameForm
          onSuccess={() => {
            router.push("/games"); // go back after saving
          }}
        />
      </div>
    );
};