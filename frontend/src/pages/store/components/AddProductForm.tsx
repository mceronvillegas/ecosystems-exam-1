import { useState } from "react";

interface Form {
    onSubmit: (product: {
        name: string;
        price: string;
        description: string;
    }) => Promise<void>;
}

export const AddProductForm = ({ onSubmit }: Form) => {
    const [form, setForm] = useState({ name: "", price: "", description: "" });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await onSubmit(form);
        setForm({ name: "", price: "", description: "" });
    };

    const inputStyle =
        "w-full border-2 border-blue p-2 outline-none font-lexend text-sm focus:bg-blue/5 transition-all";

    return (
        <section>
            <div className="mb-6 border-b-2 border-dashed border-blue pb-4">
                <h2 className="text-blue text-5xl font-instrument">Add a Product</h2>
            </div>
            <form onSubmit={handleSubmit} className=" bg-white">
                <div>
                    <p className="text-sm font-semibold text-blue mb-2">Item Name</p>
                    <input
                        type="text"
                        required
                        value={form.name}
                        className={inputStyle}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue my-2 ">Price ($)</p>
                    <input
                        type="number"
                        required
                        value={form.price}
                        className={inputStyle}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue my-2">Description</p>
                    <textarea
                        required
                        value={form.description}
                        className={`${inputStyle} h-24 resize-none`}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>
                <button className="w-full bg-blue mt-2 text-white font-semibold py-2 hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer">
                    Save to Menu
                </button>
            </form>
        </section>
    );
};
