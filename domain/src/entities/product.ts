import type { Entity } from "../utils/types/entity.js";

export interface Product extends Entity {
    //id: string,//heredado de Entity por lo tanto no es necesario
    name: string,
    price: number
}