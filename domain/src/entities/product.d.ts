import type { Entity } from "../utils/types/entity.js";
export interface Product extends Entity {
    name: string;
    price: number;
}
