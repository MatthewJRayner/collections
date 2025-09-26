"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Instrument } from "@/types/instrument";
import InstrumentForm from "@/components/instruments/InstrumentForm";

export default function EditInstrumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [instruments, setInstruments] = useState<Instrument | null>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/instruments/${id}/`)
      .then((res) => res.json())
      .then((data) => setInstruments(data));
  }, [id]);

  if (!instruments) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Instrument</h1>
      <InstrumentForm
        initialData={instruments}
        onSuccess={() => {
          router.push("/instruments");
        }}
      />
    </div>
  );
}
