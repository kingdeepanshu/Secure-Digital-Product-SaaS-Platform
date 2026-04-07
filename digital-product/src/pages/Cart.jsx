import { useEffect, useState } from "react";
import API from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
  API.get("/cart")
    .then((res) => {
      console.log("CART DATA:", res.data); // debug
      setCart(res.data);
    })
    .catch((err) => {
      console.log("ERROR:", err.response?.data);
    });
}, []);

  console.log(cart);
  

  const checkout = async () => {
    const res = await API.post("/create-order");

    const options = {
      key: "rzp_test_SXUU1dfFg5JCRk",
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