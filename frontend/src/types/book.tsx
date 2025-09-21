export type YearSpecificityChoices = "exact" | "year" | "decade" | "century" | "millenium" | "unknown"

export type Book = {
    id?: number;
    title: string;
    alt_title?: string;
    author: string;
    alt_name?: string;
    series?: string;
    volume?: string;
    date_published?: string;
    year_released?: string;
    year_specificity?: YearSpecificityChoices;
    rating?: string;
    industry_rating?: string;
    genre?: string[];
    tags?: string[];
    review?: string;
    page_count?: string;
    format?: string;
    cover?: string;
    external_links?: string;
    ISBN?: string;
    synopsis?: string;
    publisher?: string;
    edition?: string;
    edition_read_year?: string;
    language?: string;
    og_language?: string;
    country?: string;
    read?: boolean;
    favourite?: boolean;
    readlist?: boolean;
    notes?: string;
    date_read?: string;
}