import { FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

const Home = ({ products }: { products: Product[] }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [shoppingCart, setShoppingCart] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const [productList, setProductList] = useState(products);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await (
      await fetch("/api/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, price, inventory }),
      })
    ).json();

    const updatedProducts = await (await fetch("/api/get-products")).json();

    setProductList(updatedProducts);

    formRef.current?.reset();
  };

  return (
    <div className="grid min-h-screen grid-cols-4 gap-5 p-5">
      <div className="col-span-4 flex items-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-2">
        <h6 className="text-xl font-bold text-white">Inventory System</h6>
      </div>
      <div className="h-full w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-white">
        <form ref={formRef} onSubmit={(e) => handleSubmit(e)}>
          <h5 className="mb-10 text-lg font-semibold">Add Item</h5>
          <fieldset className="grid grid-cols-1 gap-5">
            <label htmlFor="name">
              Item Name:
              <input
                type="text"
                name="name"
                className="mt-1 w-full rounded-lg border-zinc-800 bg-zinc-900"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label htmlFor="description">
              Description:
              <textarea
                name="description"
                id="description"
                className="mt-1 w-full resize-none rounded-lg border-zinc-800 bg-zinc-900"
                rows={3}
                required
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </label>
            <label htmlFor="price">
              Price:
              <input
                type="text"
                name="price"
                className="mt-1 w-full rounded-lg border-zinc-800 bg-zinc-900"
                required
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
            </label>
            <label htmlFor="inventory">
              Inventory:
              <input
                type="text"
                name="inventory"
                className="mt-1 w-full rounded-lg border-zinc-800 bg-zinc-900"
                required
                onChange={(e) => setInventory(parseInt(e.target.value))}
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-700 py-2"
            >
              Create Item
            </button>
          </fieldset>
        </form>
      </div>
      <div className="col-span-2 h-full w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-white">
        <h5 className="mb-10 text-lg font-semibold">Shop Items:</h5>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Name</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Edit</th>
              <th>Add to Cart</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product) => (
              <tr className="hover:bg-zinc-900" key={product.name}>
                <td className="pr-10">{product.name}</td>
                <td className="pr-10">${product.price}</td>
                <td className="pr-10">{product.inventory}</td>
                <td className="cursor-pointer pr-10">
                  <PencilSquareIcon className="w-5" />
                </td>
                <td className="pr-10">
                  <PlusIcon
                    className="w-5 cursor-pointer"
                    onClick={(e) => {
                      setShoppingCart((prev) => [...prev, product]);
                      const x = shoppingCart
                        .map((item) => item.price)
                        .reduce((prev, next) => prev + next, product.price);

                      setTotal(x);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-fit rounded-xl border border-zinc-900 bg-zinc-900/50 p-5 text-white">
        <h6 className="mb-10 text-lg font-semibold">Shopping Cart</h6>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {shoppingCart.map((item) => (
              <tr className="hover:bg-zinc-900">
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <TrashIcon className="w-5 cursor-pointer text-rose-800" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shoppingCart.length > 0 && (
          <div className="mt-3 border-t border-zinc-900 pt-3">
            <h6 className="text-xl font-semibold">Total: ${total}</h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const products = await (
    await fetch("http://localhost:3000/api/get-products")
  ).json();

  return {
    props: { products },
  };
};
