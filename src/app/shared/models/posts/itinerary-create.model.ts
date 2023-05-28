import { ImageRequest } from "./image-request.model";

export interface ItineraryCreate{
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    images: ImageRequest[];
}