export type User = {
    id: string;
    email: string;
    name: string;
    role: "consumer" | "store" | "delivery";
}
