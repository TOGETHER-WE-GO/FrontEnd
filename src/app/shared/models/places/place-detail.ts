import { PlaceFeatureType } from "./place-type";

export interface PlaceDetail{
    id: number;
    name: string,
    images: string[] | null,
    description: string,
    subTypes: PlaceFeatureType[] | null,
    services: PlaceFeatureType[] | null,
    types: PlaceFeatureType[] | null,
    rating: number,
    tagCount: number,
    viewScore: number
}