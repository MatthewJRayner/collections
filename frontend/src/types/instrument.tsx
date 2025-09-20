export type CategoryChoices = "string" | "keyboard" | "percussion" | "wind" | "brass" | "electronic" | "other"

export type Instrument = {
    id?: number;
    instrument: string;
    brand?: string;
    name: string;
    maker?: string;
    category: CategoryChoices;
    type?: string;
    year?: string;
    country?: string;
    owned: boolean;
    price?: string;
    photo?: string;
    link?: string;
    notes?: string;
    date_bought?: string;
    materials?: string;
}