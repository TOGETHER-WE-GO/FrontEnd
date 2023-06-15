import { PlaceSearch } from "../places/place-search.model";

export interface TripPlanItinerary {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    places: PlaceSearch[];
}