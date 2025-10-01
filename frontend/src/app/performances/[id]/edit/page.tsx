"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Performance } from "@/types/performance";
import PerformanceForm from "@/components/performances/PerformanceForm";

export default function EditPerformancePage() {
  const { id } = useParams();
  const router = useRouter();
  const [performance, setPerformances] = useState<Performance | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/performances/${id}/`)
      .then((res) => res.json())
      .then((data) => setPerformances(data));
  }, [id]);

  if (!performance) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Performance</h1>
      <PerformanceForm
        initialData={performance}
        onSuccess={() => {
          router.push("/performances");
        }}
      />
    </div>
  );
}
