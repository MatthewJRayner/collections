"use client";

import ArtForm from "@/components/art/ArtForm";
import { useRouter } from "next/navigation";

export default function NewArtPage() {
    const router = useRouter();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add To Your Artwork Collection</h1>
        <ArtForm
          onSuccess={() => {
            router.push("/art"); // go back after saving
          }}
        />
      </div>
    );
};