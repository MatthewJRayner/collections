"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Art } from "@/types/art";
import ArtForm from "@/components/art/ArtForm";

export default function EditArtPage() {
  const { id } = useParams();
  const router = useRouter();
  const [art, setArt] = useState<Art | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/art/${id}/`)
      .then((res) => res.json())
      .then((data) => setArt(data));
  }, [id]);

  if (!art) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Artwork</h1>
      <ArtForm
        initialData={art}
        onSuccess={() => {
          router.push("/art");
        }}
      />
    </div>
  );
}
