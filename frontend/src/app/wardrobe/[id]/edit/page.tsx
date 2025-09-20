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
        fetch(`http://127.0.0.1:8000/api/wardrobe/${id}/`)
            .then((res) => res.json())
            .then((data) => setClothes(data));
    }, [id]);

    if (!clothes) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Wardrobe</h1>
            <ClothesForm
            initialData={clothes}
            onSuccess={() => {
                router.push("/wardrobe");
            }}
            />
        </div>
    );
}