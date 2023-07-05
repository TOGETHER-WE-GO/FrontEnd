import { Comments } from "./comment.model";
import { ImageRequest } from "./image-request.model";
import { Image } from "./image.model";
import { ItineraryCreate } from "./itinerary-create.model";
import { Itinerary } from "./itinerary.model";
import { Likes } from "./like.model";


export class Post{
    id: string;
    caption: string;
    userId: string;
    userName: string;
    userAvatar: string;
    displayImage: Image;
    createdAt: Date;
    itineraries: Itinerary[] = [];
    likeCount: number;
    commentCount: number;
    comments: Comments[];
    likes: Likes[];
}