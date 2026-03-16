export interface User {
    id: number;
    name?: string;
    email?: string;
    role: "admin" | "user";
}

export type QueueItem = {
    id: number;
    token_number: number;
    department_id: number;
    counter_id: number;
    status: "waiting" | "serving" | "completed";
    created_at: string;
    user_id?: number;
    department_name?: string;
    counter_name?: string;
};
