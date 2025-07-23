// components/CategoryCard.js
"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

export default function CategoryCard({ title, items, user }) {
  const { addToCart } = useCart();

  const handleAdd = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="w-full px-8 py-2">
      <h2 className="text-2xl text-pink-800 font-semibold mb-4 border-b border-gray-600 pb-2">
        {title}
      </h2>

      <div className="category-card flex gap-4 h-[32vh] w-full overflow-x-auto flex-nowrap scroll-smooth scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300">
        {items.length > 0 ? (
          items.map((item) => {
            let imagePath = "/images/Background-1.jpg";
            if (item.image) {
              if (item.image.startsWith("http") || item.image.startsWith("/")) {
                imagePath = item.image;
              } else {
                imagePath = "/" + item.image;
              }
            }

            return (
              <div
                key={item._id}
                className="items-card flex-shrink-0 bg-gray-100 flex flex-col gap-2 h-full w-[17vw] text-black p-2 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <div className="w-full h-[120px] relative rounded-md overflow-hidden">
                  <Image
                    src={imagePath}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex flex-col w-full items-center justify-center">
                  <h3 className="text-xl font-bold text-center">{item.name}</h3>
                  <p className="text-sm text-gray-700 text-center">{item.description}</p>
                </div>

                <div className="flex w-full justify-between mt-2 items-center">
                  <p className="text-lg font-semibold">₹{item.price}</p>
                  {user?.role !== "admin" && (
                    <button
                      onClick={() => handleAdd(item)}
                      className="px-6 py-1 rounded-md bg-black text-white hover:bg-pink-800 cursor-pointer"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 italic">No items available.</p>
        )}
      </div>
    </div>
  );
}
