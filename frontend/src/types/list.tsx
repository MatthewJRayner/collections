import { Film } from "./film";
import { Book } from "./book";

export type List = {
  id: number;
  name: string;
  description?: string;
  category: string;
  films?: Film[];
  books?: Book[];
  created_at: string;
}