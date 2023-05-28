import { Reply } from "./reply.model"

export class Comments{
    id: string
    postId: string
    message: string
    userId: string
    userAvatar: string
    userName: string
    createdAt: Date
    replies: Reply[]
}