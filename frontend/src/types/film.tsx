export type Cast = {
    actor: string;
    role: string;
}

export type Crew = {
    name: string;
    role: string;
}

export type Award = {
    award: string;
    won: boolean;
    category: string;
}

export type Film = {
    id?: number;
    title: string;
    alt_title?: string;
    director: string;
    alt_name?: string;
    cast?: Cast[];
    crew?: Crew[];
    rating?: string;
    industry_rating?: string;
    review?: string;
    series?: string;
    volume?: string;
    blurb?: string;
    synopsis?: string;
    external_links?: string;
    language?: string;
    country?: string;
    festival?: string;
    poster?: string;
    background_pic?: string;
    medium?: string;
    sound: boolean;
    colour: boolean;
    runtime?: string;
    genre?: string[];
    tags?: string[];
    awards_won?: Award[];
    budget?: string;
    box_office?: string;
    release_date?: string;
    notes?: string;
    favourite: boolean;
    seen: boolean;
    date_watched?: string;
    watchlist: boolean;
};