"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clothing } from "@/types/clothing";
import ClothesForm from "@/components/wardrobe/ClothesForm";

export default function EditClothesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [clothes, setClothes] = useState<Clothing | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wardrobe/${id}/`)
      .then((res) => res.json())
      .then((data) => setClothes(data));
  }, [id]);

  if (!clothes) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Wardrobe</h1>
      <ClothesForm
        initialData={clothes}
        onSuccess={() => {
          router.push("/wardrobe");
        }}
      />
    </div>
  );
}
