import type { Order } from "../../../types/Order";
import { OrderCard } from "./OrderCard";

interface Props {
    orders: Order[];
    onAcceptOrder: (id: number) => void;
}

export const OrderList = ({ orders, onAcceptOrder }: Props) => {
    return (
        <div className="">
            <header className="border-b-2 border-dashed border-blue pb-4 flex justify-between items-end">
                <h2 className="text-blue text-5xl font-instrument">Incoming Orders</h2>
                <p className="text-blue font-semibold ">( {orders.length} Orders )</p>
            </header>

            {orders.length > 0 ? (
                <div className="grid grid-cols-3 mt-8 gap-8">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} onAccept={onAcceptOrder} />
                    ))}
                </div>
            ) : (
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
            )}
        </div>
    );
};
