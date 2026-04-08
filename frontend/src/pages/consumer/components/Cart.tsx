import { useState } from "react";
import type { Product } from "../../../types/Product";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  onRemove: (id: number) => void;

  onCheckout: (paymentMethod: string, address: string) => void;
  submitting: boolean;
}

export default function Cart({
  cart,
  onRemove,
  onCheckout,
  submitting,
}: CartProps) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [address, setAddress] = useState("");

  const subtotal = cart.reduce(
    (acc, i) => acc + i.product.price * i.quantity,
    0,
  );
  const deliveryFee = 2000;
  const total = subtotal + deliveryFee;

  return (
    <div className="w-96 block">
      <div className="bg-white border-4 border-blue p-8">
        <header className="text-center mb-6">
          <h2 className="text-blue text-5xl font-instrument mb-1 leading-none">
            Your Check
          </h2>
          <div className="border-t-2 border-dashed border-blue mt-4" />
        </header>

        {/* Lista de productos */}
        <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="text-blue font-semibold capitalize">
                  {item.product.name}
                </p>
                <p className="text-blue font-semibold">
                  {item.quantity} x ${item.product.price}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue font-semibold">
                  ${item.product.price * item.quantity}
                </span>
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="text-blue font-semibold text-lg cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-blue/50">
              <h2 className="text-blue/50 text-2xl">Your check is empty</h2>
            </div>
          )}
        </div>

        {/* --- FORMULARIO DE ENVÍO Y PAGO --- */}
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-blue font-semibold block mb-1 uppercase text-[10px]">
              Payment Method
            </p>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border-2 border-blue p-2 font-lexend text-blue font-semibold outline-none bg-white text-sm"
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>

          <div>
            <p className="text-blue font-semibold block mb-1 uppercase text-[10px]">
              Delivery Address
            </p>
            <input
              type="text"
              required
              placeholder="Ej. Calle 123 #45-67"
              value="Salón 301"
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border-2 border-blue p-2 font-lexend text-blue font-semibold outline-none placeholder:text-blue/30 text-sm"
            />
          </div>
        </div>

        <footer className="border-t-2 border-dashed border-blue pt-4 space-y-2 font-lexend">
          <div className="flex justify-between font-semibold text-blue text-sm">
            <p>Subtotal</p>
            <p>${subtotal}</p>
          </div>
          <div className="flex justify-between font-semibold text-blue text-sm">
            <p>Delivery Fee</p>
            <p>${deliveryFee}</p>
          </div>
          <div className="flex justify-between font-semibold text-5xl text-blue border-t-2 border-dashed border-blue mt-4 pt-4">
            <h2>Total</h2>
            <h2>${cart.length > 0 ? total : 0}</h2>
          </div>
        </footer>

        <button
          onClick={() => onCheckout(paymentMethod, address)}
          disabled={submitting || cart.length === 0 || !address.trim()}
          className="mt-8 w-full bg-blue text-white font-semibold py-4 transition-all cursor-pointer disabled:grayscale disabled:cursor-not-allowed uppercase tracking-widest"
        >
          {submitting ? "Sending..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
