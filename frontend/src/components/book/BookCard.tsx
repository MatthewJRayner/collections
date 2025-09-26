"use client";

import Link from "next/link";
import { Book } from "@/types/book";
import { formatYear } from "@/utils/formatters";

type BookProps = {
    book: Book;
}

export default function BookCard({ book }: BookProps) {
    return (
        <Link href={`/books/${book.id}`}>
            <div className="relative group w-full aspect-[2/3] rounded overflow-hidden shadow cursor-pointer">
                {book.cover ? (
                    <img 
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral flex items-center justify-center">
                        No Poster
                    </div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-70 transition-opacity duration-300 "></div>
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col items-center justify-center text-center">
                        <h3 className="text-white text-lg font-semibold">{book.title}</h3>
                        {book.author && (
                            <p className="text-gray-300 text-sm">{book.author}</p>
                        )}
                        {book.year_released && (
                            <p className="text-gray-300 text-xs mt-1">{formatYear({ year: book.year_released, year_specificity: Array.isArray(book.year_specificity) ? book.year_specificity.join(",") : book.year_specificity })}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}