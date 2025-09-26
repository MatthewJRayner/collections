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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/`)
      .then((res) => res.json())
      .then((data) => setBook(data));
  }, [id]);

  if (!book) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <div className="flex items-center w-full space-x-2">
        <h1 className="text-xl sm:text-2xl font-bold">Edit book</h1>
        <Link
          href={`/books/${id}`}
          className="text-sm font-semibold transition-all duration-300 hover:scale-105 hover:text-danger active:scale-90"
        >
          ⏴Back
        </Link>
      </div>
      <BookForm
        initialData={book}
        onSuccess={() => {
          router.push(`/books/${id}`);
        }}
      />
    </div>
  );
}
