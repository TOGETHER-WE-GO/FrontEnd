export interface Reply{
    id: string;
    postId: string;
    commentId: string;
    message: string;
    userId: string;
    userAvatar: string;
    userName: string;
    createdAt: Date;
}