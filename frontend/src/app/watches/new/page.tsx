"use client";

import WatchForm from "../../../components/watch/WatchForm";
import { useRouter } from "next/navigation";

export default function NewWatchPage() {
    const router = useRouter();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Watch</h1>
        <WatchForm
          onSuccess={() => {
            router.push("/watches"); // go back after saving
          }}
        />
      </div>
    );
};