"use client";

import ExtraForm from "@/components/extra/ExtraForm";
import { useRouter } from "next/navigation";

export default function NewExtraPage() {
    const router = useRouter();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add To Your Collection</h1>
        <ExtraForm
          onSuccess={() => {
            router.push("/extra"); // go back after saving
          }}
        />
      </div>
    );
};