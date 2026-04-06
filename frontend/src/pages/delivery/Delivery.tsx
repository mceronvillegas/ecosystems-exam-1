import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, getCurrentUser } from "../../api/client";
import { type Order } from "../../types/Order";
import { type User } from "../../types/User";

export default function Delivery() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser() as User;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "delivery") navigate("/auth");
  }, [user, navigate]);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get("/orders");

      const deliveryOrders = data.filter(
        (o: Order) =>
          o.status === "accepted" ||
          (o.status === "picked" && o.deliveryId === user?.id),
      );

      setOrders(deliveryOrders);
    } catch (error) {
      console.error("Error al obtener envíos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (
    orderId: number,
    newStatus: Order["status"],
  ) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = { status: newStatus };

      if (newStatus === "picked") {
        payload.deliveryId = user?.id;
      }

      await apiClient.patch(`/orders/${orderId}`, payload);
      fetchOrders();
    } catch (error) {
      alert("Error en el despacho: " + error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="bg-white min-h-screen font-lexend">
      <nav className="px-12 py-8 flex justify-between items-center bg-blue sticky top-0 z-50 shadow-lg">
        <div>
          <h1 className="text-white text-[80px]  font-instrument leading-none">
            FOODIES
          </h1>
          <p className="text-white font-semibold mt-1">
            Courier Name: {user?.username}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="font-instrument border-white text-white text-4xl underline decoration-2 underline-offset-4 decoration-white/0 hover:decoration-white transition-all cursor-pointer mt-8"
        >
          Log Out
        </button>
      </nav>

      <main className="p-12">
        <header className="mb-4 border-b-2 border-dashed border-blue pb-4 flex justify-between items-end">
          <h2 className="text-blue text-6xl font-instrument italic leading-none">
            Active Orders
          </h2>
          <p className="text-blue font-semibold text-xl">( {orders.length} )</p>
        </header>

        {orders.length === 0 && !isLoading ? (
          <div className="pt-8 text-center flex items-end">
            <h2 className="text-blue/50 text-4xl font-instrument italic">
              Wow this is lonely, No orders yet
            </h2>

            <h2 className="text-blue/50 ml-1 text-4xl font-instrument italic animate-bounce">
              .
            </h2>

            <h2 className="text-blue/50 text-4xl font-instrument italic animate-bounce [animation-delay:200ms]">
              .
            </h2>

            <h2 className="text-blue/50 text-4xl font-instrument italic animate-bounce [animation-delay:400ms]">
              .
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6 w-full">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`receipt-container  p-6 bg-white flex flex-col justify-between transition-all hover:translate-y-1 shadow-lg h-full ${
                  order.status === "picked" ? "bg-blue/10 border-dashed" : ""
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-full">
                      <h2 className="text-blue font-semibold text-4xl  ">
                        Ticket #{order.id}
                      </h2>
                      <p className="font-semibold text-blue mb-2 italic">
                        ( Payed with {order.paymentMethod} )
                      </p>
                      <span
                        className={`inline-block  font-semibold py-2 w-full capitalize bg-blue text-white text-center`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="">
                    <div className="border-t-2 border-dashed border-blue pt-2">
                      <p className=" font-semibold text-blue  mb-2">
                        Delivery Address
                      </p>
                      <p className="text-blue text-sm mb-4">
                        📍 {order.address}
                      </p>
                    </div>

                    <div>
                      <p className=" font-semibold text-blue  mb-1">
                        Order Detail
                      </p>
                      <p className="text-blue text-sm ">{order.orderDetail}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="border-t-2 border-dashed border-blue pt-4 mb-4 flex justify-between items-end">
                    <p className="text-blue text-4xl font-bold leading-none">
                      ${order.totalPrice}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  {order.status === "accepted" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "picked")}
                      className="w-full bg-blue text-white font-semibold py-2 transition-all cursor-pointer "
                    >
                      Accept & Pick Up
                    </button>
                  )}

                  {order.status === "picked" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "arrived")}
                      className="w-full bg-blue text-white font-semibold py-2 transition-all cursor-pointer"
                    >
                      Confirm Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
