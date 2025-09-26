"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Extra } from "@/types/extra";
import ExtraForm from "@/components/extra/ExtraForm";

export default function EditExtraPage() {
  const { id } = useParams();
  const router = useRouter();
  const [extra, setExtra] = useState<Extra | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/extra/${id}/`)
      .then((res) => res.json())
      .then((data) => setExtra(data));
  }, [id]);

  if (!extra) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Item</h1>
      <ExtraForm
        initialData={extra}
        onSuccess={() => {
          router.push("/extra");
        }}
      />
    </div>
  );
}
