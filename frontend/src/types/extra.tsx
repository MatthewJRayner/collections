export type YearSpecificity = "exact" | "year" | "decade" | "century" | "millennium" | "unknown"

export type Extra = {
    id?: number;
    owned: boolean;
    theme: string;
    brand?: string;
    model: string;
    price?: string;
    links?: string;
    year?: string;
    year_specificity?: YearSpecificity;
    additional_info?: string;
    date_bought?: string;
}