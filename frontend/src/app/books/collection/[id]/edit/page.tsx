"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookCopy } from "@/types/bookCopy";
import BookCopyForm from "@/components/book/BookCopyForm";

export default function EditWatchPage() {
    const { id } = useParams();
    const router = useRouter();
    const [bookCopy, setBookCopy] = useState<BookCopy | null>(null);

    useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/book-collections/${id}/`)
        .then((res) => res.json())
        .then((data) => setBookCopy(data));
    }, [id]);

    if (!bookCopy) return <p className="p-6">Loading...</p>;

    return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Film</h1>
        <BookCopyForm
        initialData={bookCopy}
        onSuccess={() => {
            router.push("/books/collection");
        }}
        />
    </div>
    );
}