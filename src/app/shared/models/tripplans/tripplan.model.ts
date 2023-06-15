import { Image } from "../posts/image.model";
import {TripPlanItinerary} from './tripplan-itinerary.model'

export interface TripPlan {
    id: string;
    propertyIdentifier: string;
    userId: string;
    userName: string;
    userAvatar: string;
    title: string;
    note: string;
    startDate: string;
    endDate: string;
    locations: string[];
    displayImage: Image;
    createdAt: string;
    updatedAt: string;
    tripPlanItineraries: TripPlanItinerary[];
}