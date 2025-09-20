"use client";

import BookForm from "@/components/book/BookForm";
import { useRouter } from "next/navigation";

export default function NewBookPage() {
    const router = useRouter();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Track A New Book</h1>
            <BookForm 
                onSuccess={() => {
                    router.push("/books");
                }}
            />
        </div>
    );
};