export type FilmPhysicalFormat = "dvd" | "blu-ray" | "4k" | "vhs" | "laserdisc" | "betamax" | "film" | "digital" | "other";
export type FilmPhysicalType = "movie" | "series" | "documentary" | "short" | "other";

export type FilmPhysical = {
    id?: number;
    owned: boolean;
    format: FilmPhysicalFormat[];
    title: string;
    director?: string;
    release_year?: string;
    genre?: string[];
    type: FilmPhysicalType[];
    cover_art?: string;
    price?: number;
    language?: string;
    country?: string;
    studio?: string;
    runtime?: string;
    link?: string;
    notes?: string;
    date_bought?: string;
}