import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../../api/client";
import { type Product } from "../../../types/Product";
import Cart from "./Cart";

export default function StoreMenu({ storeId }: { storeId: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    [],
  );
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await apiClient.get("/products");

      const storeProducts = res.data.filter(
        (p: Product) => String(p.storeId) === String(storeId),
      );
      setProducts(storeProducts);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  }, [storeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const isAdded = prev.find((i) => i.product.id === product.id);
      return isAdded
        ? prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [...prev, { product, quantity: 1 }];
    });
  };

  const handleCheckout = async (paymentMethod: string, address: string) => {
    setSubmitting(true);

    try {
      const subtotal = cart.reduce(
        (acc, i) => acc + i.product.price * i.quantity,
        0,
      );
      const total = subtotal + 2000;

      const payload = {
        storeId: Number(storeId),
        address: address,
        paymentMethod: paymentMethod,
        totalPrice: total,
        orderDetail: cart
          .map((i) => `${i.quantity}x ${i.product.name}`)
          .join(", "),
        products: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      await apiClient.post("/orders", payload);

      alert("¡Pedido confirmado!");
      window.location.reload();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error al procesar la orden";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row gap-16 items-start">
      <div className="grid grid-cols-2 gap-8 flex-1">
        {products.map((p) => (
          <div key={p.id} className="p-6 bg-blue group transition-all ">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-white text-5xl font-instrument capitalize leading-none tracking-tighter italic">
                {p.name}
              </h2>
              <p className="text-white font-semibold text-lg italic">
                ( ${p.price} )
              </p>
            </div>
            <button
              onClick={() => addToCart(p)}
              className="mt-auto bg-white w-full text-blue font-black py-3 px-6
                         transition-all cursor-pointer "
            >
              Add to Order
            </button>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-2 border-4 border-dashed border-blue/20 p-20 text-center">
            <p className="text-blue/30 text-3xl font-instrument italic">
              This store has no menu items yet.
            </p>
          </div>
        )}
      </div>

      <Cart
        cart={cart}
        onRemove={(id) =>
          setCart((prev) => prev.filter((i) => i.product.id !== id))
        }
        onCheckout={handleCheckout}
        submitting={submitting}
      />
    </div>
  );
}
