import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, getCurrentUser } from "../../api/client";
import { type Order } from "../../types/Order";
import { type User } from "../../types/User";
import StoreList from "./components/StoreList.tsx";
import StoreMenu from "./components/StoreMenu.tsx";

export default function Consumer() {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const user = getCurrentUser() as User;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "consumer") navigate("/auth");
  }, [user, navigate]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await apiClient.get("/orders");
      setMyOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="bg-white min-h-screen font-lexend">
      <nav className="px-12 py-8 flex justify-between items-center bg-blue sticky top-0 z-50 shadow-lg">
        <div>
          <h1 className="text-white text-[80px] font-instrument leading-none">
            FOODIES
          </h1>
          <p className="text-white font-semibold mt-1  ">
            Welcome Back, {user?.username}!
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="font-instrument border-white text-white text-4xl underline decoration-2 underline-offset-4 decoration-white/0 hover:decoration-white transition-all cursor-pointer mt-8"
        >
          Log Out
        </button>
      </nav>

      <div className="p-12">
        {!selectedStoreId ? (
          <section>
            <div className="mb-10 border-b-2 border-dashed border-blue pb-4 flex justify-between items-end">
              <h2 className="text-blue text-5xl font-instrument">
                Local Stores
              </h2>
              <p className="text-blue text-sm font-semibold uppercase">
                Select to Start
              </p>
            </div>
            <StoreList onSelectStore={setSelectedStoreId} />
          </section>
        ) : (
          <section>
            <div className="mb-10 flex items-end gap-6 border-b-2 border-dashed border-blue pb-6">
              <button
                onClick={() => setSelectedStoreId(null)}
                className=" text-blue  hover:underline transition-all cursor-pointer  active:translate-y-1 active:shadow-none"
              >
                Back
              </button>
              <h2 className="text-blue text-5xl font-instrument">Menu</h2>
            </div>
            <StoreMenu storeId={selectedStoreId} />
          </section>
        )}

        <div className="mt-24">
          <div className="mb-10 border-b-2 border-dashed border-blue pb-4">
            <h2 className="text-blue text-5xl font-instrument">Orders</h2>
          </div>

          <div className="grid grid-cols-4 gap-8 w-full">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="receipt-container w-full h-full p-6 bg-white flex flex-col justify-between shadow-lg hover:-translate-y-1 transition-all cursor-pointer "
              >
                <div>
                  <h2 className="text-blue font-semibold text-2xl lg:text-3xl">
                    Ticket #{order.id}
                  </h2>

                  <div className="flex gap-2 mt-2">
                    <span
                      className={`font-bold px-4 py-1 capitalize border-2 w-full text-center bg-blue text-white`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-blue mt-6 font-medium flex items-start gap-1">
                    📍
                    {order.address}
                  </p>
                </div>

                <div className="mt-auto">
                  <p className="text-blue text-4xl font-bold border-t-2 mt-6 pt-4 border-dashed border-blue flex justify-between items-center">
                    ${order.totalPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {myOrders.length === 0 && (
            <div className="pt-8 text-center flex items-end justify-center">
              <h2 className="text-blue/30 text-4xl font-instrument italic">
                Wow this is lonely, No orders yet
              </h2>

              <h2 className="text-blue/30 ml-1 text-4xl font-instrument italic animate-bounce">
                .
              </h2>

              <h2 className="text-blue/30 text-4xl font-instrument italic animate-bounce [animation-delay:200ms]">
                .
              </h2>

              <h2 className="text-blue/30 text-4xl font-instrument italic animate-bounce [animation-delay:400ms]">
                .
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
