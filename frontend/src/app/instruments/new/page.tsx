"use client";

import InstrumentForm from "@/components/instruments/InstrumentForm";
import { useRouter } from "next/navigation";

export default function NewInstrumentPage() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        Add To Your Instrument Collection
      </h1>
      <InstrumentForm
        onSuccess={() => {
          router.push("/instruments"); // go back after saving
        }}
      />
    </div>
  );
}
