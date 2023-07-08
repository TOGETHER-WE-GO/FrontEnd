import { PlaceSearch } from '../places/place-search.model';
import {Image} from './image.model'
export interface Itinerary{
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    images: Image[];
    places: PlaceSearch[];
}