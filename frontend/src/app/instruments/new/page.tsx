"use client";

import InstrumentForm from "@/components/instruments/InstrumentForm";
import { useRouter } from "next/navigation";

export default function NewInstrumentPage() {
    const router = useRouter();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add To Your Instrument Collection</h1>
        <InstrumentForm
          onSuccess={() => {
            router.push("/instruments"); // go back after saving
          }}
        />
      </div>
    );
};