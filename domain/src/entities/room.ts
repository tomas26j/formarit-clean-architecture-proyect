import { Entity } from "../utils/types";
export interface Room extends Entity {
    number: string;
    type: RoomType;
    pricePerNight: number;
    
}

const RoomTypes = {
    STANDARD: 'STANDARD',
    DELUXE: 'DELUXE',
    SUITE: 'SUITE'
} as const;

type RoomType = (typeof RoomTypes)[keyof typeof RoomTypes]

