// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function Cart() {
//   const [cart, setCart] = useState(null);

//   useEffect(() => {
//   API.get("/cart")
//     .then((res) => {
//       console.log("CART DATA:", res.data); // debug
//       setCart(res.data);
//     })
//     .catch((err) => {
//       console.log("ERROR:", err.response?.data);
//     });
// }, []);

//   console.log(cart);
  

//   const checkout = async () => {
//     const res = await API.post("/create-order");

//     const options = {
//       key: "rzp_test_SXUU1dfFg5JCRk",
//       amount: res.data.amount,
//       currency: "INR",
//       order_id: res.data.orderId,

//       handler: function () {
//         alert("Payment Success 🎉");
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   if (!cart) return <h2>Loading...</h2>;

//   return (
//     <div>
//       <h2>Cart</h2>

//       {cart.items.map((item, i) => (
//         <div key={i}>{item.productId}</div>
//       ))}

//       <button onClick={checkout}>Pay Now</button>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/cart")
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const checkout = async () => {
    const res = await API.post("/create-order");

    const options = {
      key: "rzp_test_SXUU1dfFg5JCRk",
      amount: res.data.amount,
      currency: "INR",
      order_id: res.data.orderId,
      name: "Premium Notes",
      description: "Secure Checkout",
      handler: function () {
        alert("Payment Success 🎉");
      },
      theme: { color: "#635bff" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2 style={styles.loading}>Loading your cart...</h2>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={styles.center}>
        <h2 style={styles.empty}>Your cart is empty 🛒</h2>
      </div>
    );
  }

  const total = cart.items.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Your Cart</h1>

      <div style={styles.layout}>
        {/* LEFT: ITEMS */}
        <div style={styles.itemsContainer}>
          {cart.items.map((item, i) => (
            <div key={i} style={styles.card}>
              <div>
                <h3 style={styles.title}>{item.title}</h3>
                <p style={styles.desc}>High quality curated content</p>
              </div>

              <div style={styles.rightSection}>
                <p style={styles.price}>₹{item.price}</p>
                <button
                  style={styles.removeBtn}
                  onClick={async () => {
                    await API.post("/cart/remove", { productId: item.productId });
                    setCart((prev) => ({
                      ...prev,
                      items: prev.items.filter((_, idx) => idx !== i),
                    }));
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>

          <div style={styles.row}>
            <span>Items</span>
            <span>{cart.items.length}</span>
          </div>

          <div style={styles.row}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button style={styles.payBtn} onClick={checkout}>
            Pay Now 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= STYLES =================

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    background: "radial-gradient(circle at top, #1a1f36, #0a0c1b)",
    color: "white",
  },

  header: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "30px",
    background: "linear-gradient(90deg, #635bff, #00d4ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px",
  },

  itemsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  title: {
    fontSize: "18px",
    marginBottom: "5px",
  },

  desc: {
    fontSize: "13px",
    color: "#aaa",
  },

  rightSection: {
    textAlign: "right",
  },

  price: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#00d4ff",
    marginBottom: "8px",
  },

  removeBtn: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(255,77,79,0.2)",
    color: "#ff4d4f",
    cursor: "pointer",
  },

  summary: {
    padding: "25px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    height: "fit-content",
  },

  summaryTitle: {
    fontSize: "20px",
    marginBottom: "20px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  payBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #635bff, #00d4ff)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0a0c1b",
  },

  loading: {
    color: "#aaa",
  },

  empty: {
    color: "#888",
  },
};
