export interface Notifications{
    id: string;
    userId: string;
    title: string;
    content: string;
    fromUserName: string;
    fromAvatar: string;
    fromUserId: string;
    isRead: boolean;
    createdDate: Date;
}