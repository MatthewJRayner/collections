"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Book } from "@/types/book";
import BookForm from "@/components/book/BookForm";
import Link from "next/link";

export default function EditBooksPage() {
    const { id } = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/books/${id}/`)
            .then((res) => res.json())
            .then((data) => setBook(data))
    }, [id]);

    if (!book) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold mb-4">Edit book</h1>
                <Link
                    href={`/books/${id}`}
                    className="text-lg transition-all duration-300 hover:scale-105 hover:text-danger active:scale-90"
                >
                    ⏴
                </Link>
            </div>
            <BookForm
                initialData={book}
                onSuccess={() => {
                    router.push(`/books/${id}`);
                }}
            />
        </div>    
    )
}