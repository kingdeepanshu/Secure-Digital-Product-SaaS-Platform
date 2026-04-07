import { useEffect, useState } from "react";
import API from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    API.get("/cart").then((res) => setCart(res.data));
  }, []);

  const checkout = async () => {
    const res = await API.post("/create-order");

    const options = {
      key: "YOUR_KEY",
      amount: res.data.amount,
      currency: "INR",
      order_id: res.data.orderId,

      handler: function () {
        alert("Payment Success 🎉");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!cart) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>Cart</h2>

      {cart.items.map((item, i) => (
        <div key={i}>{item.productId}</div>
      ))}

      <button onClick={checkout}>Pay Now</button>
    </div>
  );
}