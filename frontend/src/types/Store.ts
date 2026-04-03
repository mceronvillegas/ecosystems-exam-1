export type Store = {
    id: number;
    storeName: string;
    description: string;
    status: "open" | "closed";
    ownerId: string; // string porque viene del UUID de Supabase
}