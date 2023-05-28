import {Image} from './image.model'
export interface Itinerary{
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    images: Image[];
}