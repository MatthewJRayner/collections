"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Watch } from "../../../../types/watch";
import WatchForm from "../../../../components/watch/WatchForm";

export default function EditWatchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [watch, setWatch] = useState<Watch | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/watches/${id}/`)
      .then((res) => res.json())
      .then((data) => setWatch(data));
  }, [id]);

  if (!watch) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Watch</h1>
      <WatchForm
        initialData={watch}
        onSuccess={() => {
          router.push("/watches");
        }}
      />
    </div>
  );
}
