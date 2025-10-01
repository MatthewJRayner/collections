export type YearSpecificity = "exact" | "year" | "decade" | "century" | "millennium" | "unknown";

export type Piece = {
    title: string;
    composer: string;
    movements?: string[];
}

export type Cast = {
    character: string;
    performer: string;
}

export type Performance = {
    id?: number;
    title: string;
    original_title?: string;
    performance_type: string;
    original_language?: string;
    language_heard?: string;
    composer: string;
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
}