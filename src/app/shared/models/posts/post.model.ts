import { ImageRequest } from "./image-request.model";
import { Image } from "./image.model";
import { ItineraryCreate } from "./itinerary-create.model";
import { Itinerary } from "./itinerary.model";


export class Post{
    id: string;
    caption: string;
    userId: string;
    userName: string;
    userAvatar: string;
    displayImage: Image;
    itineraries: Itinerary[] = []
    likeCount: number;
    commentCount: number;
}