export type FormatChoices = "hardcover" | "paperback" | "ebook" | "audiobook" | "other"

export type BookCopy = {
    id?: number;
    owned: boolean;
    format: FormatChoices;
    title: string;
    author: string;
    publication_date?: string;
    isbn?: string;
    genre?: string[];
    page_count?: string;
    cover_image?: string;
    price?: string;
    language?: string;
    country?: string;
    publisher?: string;
    edition?: string;
    printing?: string;
    link?: string;
    notes?: string;
    date_bought?: string;
}