import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, getCurrentUser } from "../../api/client";

import { ProductList } from "./components/ProductList";
import { StoreStatus } from "./components/StoreStatus";
import { AddProductForm } from "./components/AddProductForm";
import { OrderList } from "./components/OrderList";

import type { Store } from "../../types/Store";
import type { Order } from "../../types/Order";
import type { User } from "../../types/User";
import { type Product } from "../../types/Product";

export default function Store() {
  const [store, setStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const user = getCurrentUser() as User;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "store") navigate("/auth");
  }, [user, navigate]);

  const fetchData = useCallback(async () => {
    try {
      const { data: stores } = await apiClient.get("/stores");
      const myStore = stores.find((s: Store) => s.ownerId === user?.id);

      if (!myStore) return;
      setStore(myStore);

      try {
        const { data: allProducts } = await apiClient.get("/products");

        const myProducts = allProducts.filter(
          (p: Product) => String(p.storeId) === String(myStore.id),
        );
        setProducts(myProducts);
      } catch (e) {
        console.error("Error cargando productos:", e);
      }

      try {
        const { data: allOrders } = await apiClient.get("/orders");
        const myOrders = allOrders.filter(
          (o: Order) => String(o.storeId) === String(myStore.id),
        );
        setOrders(myOrders);
      } catch (e) {
        console.error("Error cargando órdenes (SQL DESC error):", e);
      }
    } catch (err) {
      console.error("Error crítico en fetchData:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateProduct = async (productData: any) => {
    try {
      await apiClient.post("/products", {
        ...productData,
        storeId: store?.id,
      });
      fetchData();
      alert("¡Producto agregado!");
    } catch (err) {
      alert("Error: " + err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await apiClient.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      alert("Error al eliminar producto" + err);
    }
  };

  const toggleStatus = async () => {
    if (!store) return;
    const newStatus = store.status === "open" ? "closed" : "open";
    try {
      await apiClient.patch(`/stores/${store.id}`, { status: newStatus });
      setStore({ ...store, status: newStatus });
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const handleAcceptOrder = async (id: number) => {
    try {
      await apiClient.patch(`/orders/${id}`, { status: "accepted" });
      fetchData();
    } catch (err) {
      console.error("Error al aceptar orden:", err);
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
          <h1 className="text-white text-[80px] font-instrument leading-none">
            FOODIES
          </h1>
          <p className="text-white font-semibold mt-1">
            Welcome Back, {user?.username} to "
            {store?.storeName || "your store"}"
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="font-instrument border-white text-white text-4xl underline decoration-2 underline-offset-4 decoration-white/0 hover:decoration-white transition-all cursor-pointer mt-8"
        >
          Log Out
        </button>
      </nav>

      <main className="px-12 pt-12 flex w-full">
        <div className="w-1/3 flex flex-col gap-12 border-r-2 border-dashed pr-8 border-blue">
          <StoreStatus status={store?.status} onToggle={toggleStatus} />
          <AddProductForm onSubmit={handleCreateProduct} />
        </div>

        <div className="w-2/3 pl-8">
          <OrderList orders={orders} onAcceptOrder={handleAcceptOrder} />
        </div>
      </main>
      <section className="px-12 pb-12">
        <ProductList
          products={products}
          onDeleteProduct={handleDeleteProduct}
        />
      </section>
    </div>
  );
}
