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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book-collections/${id}/`)
      .then((res) => res.json())
      .then((data) => setBookCopy(data));
  }, [id]);

  if (!bookCopy) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Film</h1>
      <BookCopyForm
        initialData={bookCopy}
        onSuccess={() => {
          router.push("/books/collection");
        }}
      />
    </div>
  );
}
