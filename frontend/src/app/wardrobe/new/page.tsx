"use client";

import ClothesForm from "@/components/wardrobe/ClothesForm";
import { useRouter } from "next/navigation";

export default function NewClothesPage() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        Add To Your Wardrobe
      </h1>
      <ClothesForm
        onSuccess={() => {
          router.push("/wardrobe"); // go back after saving
        }}
      />
    </div>
  );
}
