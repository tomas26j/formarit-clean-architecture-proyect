import type { Entity } from "../utils/types/entity";
export interface User extends Entity{
    //id: string;
    name: string;
    email: string;
}