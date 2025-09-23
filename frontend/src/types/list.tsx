import { Film } from "./film";

export type List = {
  id: number;
  name: string;
  description: string | null;
  category: string;
  films: Film[];
  created_at: string;
}