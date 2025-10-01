"use client";

import PerformanceForm from "@/components/performances/PerformanceForm";
import { useRouter } from "next/navigation";

export default function NewPerformancePage() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        Add To Your Performances
      </h1>
      <PerformanceForm
        onSuccess={() => {
          router.push("/performances"); // go back after saving
        }}
      />
    </div>
  );
}
