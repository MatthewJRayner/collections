export type PlatformChoices = "pc" | "playstation" | "xbox" | "nintendo" | "mobile" | "other"

export type Game = {
    id?: number;
    owned: boolean;
    title: string;
    special_title?: string;
    platform: PlatformChoices;
    console?: string;
    developer?: string;
    bonus_content?: string[];
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