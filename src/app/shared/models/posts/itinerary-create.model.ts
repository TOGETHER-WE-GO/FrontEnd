import { PlaceSearch } from "../places/place-search.model";
import { ImageRequest } from "./image-request.model";

export interface ItineraryCreate{
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    places: PlaceSearch[];
    images: ImageRequest[];
}