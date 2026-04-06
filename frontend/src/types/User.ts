export type User = {
    id: string;
    email: string;
    username: string;
    role: "consumer" | "store" | "delivery";
}
