export type YearSpecificity = "exact" | "year" | "decade" | "century" | "millennium" | "unknown";

export type Movement = {
    number: string;
    title: string;
}

export type Piece = {
    title: string;
    composer: string;
    movements: Movement[];
}

export type Cast = {
    character: string;
    performer: string;
}

export type Writer = {
    name: string;
    role: string;
}

export type Performance = {
    id?: number;
    title: string;
    original_title?: string;
    performance_type: string;
    original_language?: string;
    language_heard?: string;
    creator: string;
    alt_name?: string;
    country?: string;
    conductor?: string;
    director?: string;
    orchestra_ensemble?: string;
    seen: boolean;
    date_seen?: string;
    location_seen?: string;
    location_premiered?: string;
    date_premiered?: string;
    pieces?: Piece[];
    cast?: Cast[];
    rating?: string;
    review?: string;
    images?: string;
    external_links?: string;
    year?: string;
    year_specificity?: YearSpecificity;
    writers?: Writer[];
}