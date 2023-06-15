import { PlaceSearch } from "../places/place-search.model";

export interface TripPlanItineraryCreate{
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    places: PlaceSearch[];
}