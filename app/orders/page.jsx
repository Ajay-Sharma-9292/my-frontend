"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyOrderPage = () => {
  const { cartItems = [], removeFromCart, updateQuantity, getTotal } = useCart();
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const incrementQty = (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decrementQty = (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
  };

  const handlePayNow = async () => {
    try {
      const amount = getTotal();

      const orderRes = await axios.post(
        "http://localhost:4000/api/payment/order",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { orderId, amount: orderAmount } = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: "INR",
        name: "Apna Khana",
        description: "Food Order Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:4000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success(verifyRes.data.message || "Payment successful!");

            if (verifyRes.data.success) {
              router.push("/success");
            } else {
              router.push("/failure");
            }
          } catch (verifyErr) {
            console.error("Verification failed:", verifyErr);
            toast.error("Verification failed");
            router.push("/failure");
          }
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed.");
        router.push("/failure");
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Try again.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const getImagePath = (img) => {
    if (!img || img === "") return "/images/placeholder.jpg";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return "/" + img;
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-6 pt-20 bg-white/90">
          <h2 className="text-3xl font-bold text-pink-700">Your cart is empty</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 pt-20 bg-white/90 overflow-hidden">
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-700">My Cart</h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto overflow-hidden">
          {/* Items list */}
          <div className="flex-1 max-h-[70vh] overflow-y-auto space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border p-4 rounded-lg shadow-md bg-gray-50"
              >
                <Image
                  src={getImagePath(item.image)}
                  alt={item.name}
                  width={100}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decrementQty(item._id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <button
                      onClick={() => incrementQty(item._id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                    <span className="ml-6 font-bold text-lg">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    removeFromCart(item._id);
                    toast.info(`${item.name} removed from cart`);
                  }}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-semibold transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full md:w-80 h-[30vh] p-6 bg-pink-100 rounded-xl shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <p className="text-lg font-semibold">Total: ₹{getTotal()}</p>
            </div>
            <button
              onClick={handlePayNow}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrderPage;
