import { Notifications } from "./notification.model";

export interface PaginationNotification{
    data: Notifications[],
    countUnReadNotification: number
}