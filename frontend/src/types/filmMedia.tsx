export type FilmPhysicalFormat = "dvd" | "blu-ray" | "4k" | "vhs" | "laserdisc" | "betamax" | "film" | "digital" | "other";
export type FilmPhysicalType = "movie" | "series" | "documentary" | "short" | "other";

export type FilmPhysical = {
    id?: number;
    owned: boolean;
    format: FilmPhysicalFormat;
    title: string;
    director?: string;
    release_year?: string;
    genre?: string[];
    type: FilmPhysicalType;
    cover_art?: string;
    price?: string;
    language?: string;
    country?: string;
    studio?: string;
    runtime?: string;
    link?: string;
    notes?: string;
    special_features: boolean;
    features?: string[];
    date_bought?: string;
}