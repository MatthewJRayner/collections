"use client";

import Link from "next/link";
import { Film } from "../../types/film";

type FilmProps = {
    film: Film;
}

export default function FilmCard({ film }: FilmProps) {
    return (
        <Link href={`/films/${film.id}`}>
            <div className="relative group w-full aspect-[2/3] rounded overflow-hidden shadow cursor-pointer">
                {film.poster ? (
                    <img 
                        src={film.poster}
                        alt={film.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral flex items-center justify-center">
                        No Poster
                    </div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-70 transition-opacity duration-300 "></div>
                    <div className="absolute p-2 inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col items-center justify-center text-center">
                        <h3 className="text-white text-lg font-semibold">{film.title}</h3>
                        {film.director && (
                            <p className="text-gray-300 text-sm">{film.director}</p>
                        )}
                        {film.release_date && (
                            <p className="text-gray-300 text-xs mt-1">{film.release_date.substring(0,4)}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}