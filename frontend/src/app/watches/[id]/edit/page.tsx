"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Watch } from "../../../../types/watch";
import WatchForm from "../../../../components/WatchForm";

export default function EditWatchPage() {
    const { id } = useParams();
    const router = useRouter();
    const [watch, setWatch] = useState<Watch | null>(null);

    useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/watches/${id}/`)
        .then((res) => res.json())
        .then((data) => setWatch(data));
    }, [id]);

    if (!watch) return <p className="p-6">Loading...</p>;

    return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Watch</h1>
        <WatchForm
        initialData={watch}
        onSuccess={() => {
            router.push("/watches");
        }}
        />
    </div>
    );
}