export interface CreateCardPayload {
    front: string;
    back: string;
    tags: string[];
    author: string;
 }

 export interface UpdateCardPayload {
    front: string;
    back: string;
    tags: string[];
 }