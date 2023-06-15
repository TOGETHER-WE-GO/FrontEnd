import { ImageRequest } from "../posts/image-request.model";
import { TripPlanItineraryCreate } from "./tripplan-itinerary-create.model";

export interface TripPlanCreate {
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  note: string;
  startDate: Date;
  endDate: Date;
  locations: string[];
  displayImage: ImageRequest;
  tripPlanItineraries: TripPlanItineraryCreate[];
}
