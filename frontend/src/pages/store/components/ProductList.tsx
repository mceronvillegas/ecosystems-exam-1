import type { Product } from "../../../types/Product";

interface Props {
  products: Product[];
  onDeleteProduct: (id: number) => void;
}

export const ProductList = ({ products, onDeleteProduct }: Props) => {
  return (
    <section className="mt-12">
      <div className="mb-6 border-b-2 border-dashed border-blue pb-4">
        <h2 className="text-blue text-5xl font-instrument">Your Menu</h2>
      </div>

      <div className=" bg-white ">
        {products.length > 0 ? (
          <div className="">
            {products.map((product) => (
              <div
                key={product.id}
                className="py-4 mb-4 flex justify-between items-center group border-b-2 border-dashed border-blue"
              >
                <div className="flex-1 ">
                  <h4 className="text-blue font-semibold text-md italic leading-none">
                    ( {product.id} )
                    <span className="text-2xl"> {product.name}</span>
                  </h4>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-blue font-semibold text-2xl">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => {
                      if (
                        confirm("¿Seguro que quieres eliminar este producto?")
                      )
                        onDeleteProduct(product.id);
                    }}
                    className="border-2 border-blue text-blue font-semibold px-4 py-2 hover:bg-blue hover:text-white transition-all cursor-pointer active:scale-90"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue/40 font-instrument text-2xl italic text-center py-4">
            Your menu is empty. Add your first dish!
          </p>
        )}
      </div>
    </section>
  );
};
