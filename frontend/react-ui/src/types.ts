export interface User {
    id: number;
    name?: string;
    email?: string;
    role: "admin" | "user";
}

export type QueueItem = {
    user_id: number;
    token_number: number;
};
