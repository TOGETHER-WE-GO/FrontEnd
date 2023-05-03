import { PlaceFeatureType } from "./place-type";

export interface PlaceOverall{
    id: number;
    name: string,
    images: string[] | null,
    description: string,
    types: PlaceFeatureType[] | null,
    subTypes: PlaceFeatureType[] | null,
    services: PlaceFeatureType[] | null,
    avgRating: number,
    avgView: number,
    avgTag: number,
    location:string,
    distance: number
}