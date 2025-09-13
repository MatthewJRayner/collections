export type MusicFormat = "vinyl" | "cd" | "cassette" | "8cm" | "digital" | "other";
export type MusicType = "album" | "single" | "ep" | "live" | "compilation";

export type Track = {
    track_number: number;
    title: string;
    lyrics?: string;
    length?: string;
};

export type Music = {
    id?: number;
    title: string;
    artist: string;
    format: MusicFormat;
    type: MusicType;
    release_date?: string;
    catalog_number?: string;
    genre?: string[];
    length?: string;
    cover_art?: string;
    price?: string;
    language?: string;
    country?: string;
    label?: string;
    link?: string;
    notes?: string;
    owned: boolean;
    tracklist?: Track[];
};