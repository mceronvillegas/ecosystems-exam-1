import { useState, useEffect } from "react";
import { apiClient } from "../../../api/client";
import { type Store } from "../../../types/Store";

interface StoreList {
  onSelectStore: (storeId: number) => void;
}

export default function StoreList({ onSelectStore }: StoreList) {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    apiClient
      .get("/stores")
      .then((res) => setStores(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-8">
      {stores.map((store) => (
        <div
          key={store.id}
          onClick={() => store.status === "open" && onSelectStore(store.id)}
          className={`group p-6 flex flex-col bg-blue transition-all relative
            ${
              store.status === "open"
                ? "cursor-pointer  hover:translate-y-1"
                : "opacity-40 cursor-not-allowed"
            }`}
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-white text-5xl font-instrument italic pr-4 leading-tight">
              {store.storeName}
            </h2>
          </div>

          <div className="mt-auto">
            <span
              className={`inline-block border-2 border-blue px-4 py-2  font-semibold 
                ${store.status === "open" ? "bg-white text-blue" : "bg-gray-100 text-gray-400"}`}
            >
              {store.status === "open" ? "Is open" : "is closed"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
