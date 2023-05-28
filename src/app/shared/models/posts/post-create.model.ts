import { ImageRequest } from "./image-request.model";
import { ItineraryCreate } from "./itinerary-create.model";


export interface PostCreate{
    caption: string;
    userId: string;
    userName: string;
    userAvatar: string;
    displayImage: ImageRequest;
    itineraries: ItineraryCreate[]
}