import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Food App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body
        cz-shortcut-listen="true">
        <AuthProvider>
          <CartProvider>
            <main className="p-4">{children}</main>
            <ToastContainer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
