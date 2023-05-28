import { Member } from "./member.model";
import { Message } from "./message.model";

export interface ChatGroup{
    id: string;
    propertyIdentifier: string;
    ownerId: string;
    ownerName: string;
    ownerAvatar: string;
    createdAt: string;
    messages: Message[];
    members: Member[];
}