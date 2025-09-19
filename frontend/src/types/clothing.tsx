export type CategoryChoices = "shirts" | "trousers" | "suits" | "coats_jackets" | "shoes" | "neckwear" | "knitwear" | "hosiery" | "underpinnings" | "shirt_accessories" | "leather_goods" | "hats" | "tools_essentials" | "other"

export type Clothing = {
    id?: number;
    owned: boolean;
    category: CategoryChoices;
    brands?: string;
    type?: string;
    style?: string;
    colour?: string;
    pictures?: string[];
    price?: string;
    preferred_quantity?: string;
}