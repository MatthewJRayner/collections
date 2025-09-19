export type PlatformChoices = "pc" | "playstation" | "xbox" | "nintendo" | "mobile" | "other"

export type Game = {
    id?: number;
    owned: boolean;
    titel: string;
    platform: PlatformChoices;
    developer?: string;
    release_date?: string;
    genre?: string[];
    cover_art?: string;
    price?: string;
    language?: string;
    country?: string;
    publisher?: string;
    link?: string;
    notes?: string;
    series?: string;
    date_bought?: string;
}