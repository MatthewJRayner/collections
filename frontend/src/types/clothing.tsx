export type CategoryChoices = "shirts" | "trousers" | "suits" | "coats_jackets" | "shoes" | "neckwear" | "knitwear" | "hosiery" | "underpinnings" | "shirt_accessories" | "leather_goods" | "hats" | "tools_essentials" | "other"

export type Clothing = {
    id?: number;
    owned: boolean;
    category: CategoryChoices;
    brands?: string;
    type?: string;
    style?: string;
    material?: string;
    colour?: string;
    pictures?: string;
    price?: string;
    preferred_quantity?: string;
    features?: string[];
    collection?: string;
    notes?: string;
    date_bought?: string;
}