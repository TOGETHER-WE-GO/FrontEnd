export interface Message{
    id: string;
    fromUserId: string;
    fromUserAvatar: string;
    fromUserName: string;
    content: string;
    createdAt: Date;
}