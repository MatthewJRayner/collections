export type YearSpecificity = "exact" | "year" | "decade" | "century" | "millennium" | "unknown";

export type Art = {
    id?: number;
    owned: boolean;
    title?: string;
    year?: string;
    year_specificity?: YearSpecificity;
    artist?: string;
    culture?: string;
    type?: string;
    format?: string;
    info?: string;
    techniques?: string;
    movement?: string;
    tags?: string[];
    price?: string;
    photo?: string;
    link?: string;
    notes?: string;
    date_bought?: string;
}