"use client";

import BookCopyForm from "@/components/book/BookCopyForm";
import { useRouter } from "next/navigation";

export default function NewBookCopyPage() {
    const router = useRouter();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add To Your Book Collection</h1>
        <BookCopyForm
          onSuccess={() => {
            router.push("/books/collection"); // go back after saving
          }}
        />
      </div>
    );
};