import { PlaceType } from "./place-type";

export interface PlaceOverall{
    id: number;
    name: string,
    images: string[],
    shortDescription: string,
    types: PlaceType[],
    rating: number,
    tagCount: number,
    viewScore: number
}