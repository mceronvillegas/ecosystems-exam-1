import type { Order } from "../../../types/Order";

interface Props {
    order: Order;
    onAccept: (id: number) => void;
}

export const OrderCard = ({ order, onAccept }: Props) => (
    <div className="receipt-container w-full h-full p-6 bg-white flex flex-col justify-between shadow-lg hover:-translate-y-1 transition-all cursor-pointer ">
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
                    <p className=" font-semibold text-blue  mb-2">Delivery Address</p>
                    <p className="text-blue text-sm mb-4">📍 {order.address}</p>
                </div>

                <div>
                    <p className=" font-semibold text-blue  mb-1">Order Detail</p>
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

            {order.status === "pending" && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAccept(order.id);
                    }}
                    className="w-full  bg-blue text-white font-semibold py-2 hover:bg-blue hover:text-white transition-all cursor-pointer"
                >
                    Accept Order
                </button>
            )}
        </div>
    </div>
);
