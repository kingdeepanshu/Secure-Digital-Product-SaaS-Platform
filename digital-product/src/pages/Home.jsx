// import { useEffect, useState } from "react";
// import API from "../services/api";
// import ProductCard from "../components/ProductCard";

// export default function Home() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     API.get("/products").then((res) => setProducts(res.data));
//   }, []);

//   console.log(products);
  

//   const addToCart = async (id) => {
//     try {
//       await API.post("/cart", { productId: id });
//       alert("Added to cart 🛒");
//     } catch {
//       alert("Login first");
//     }
//   };

//   return (
//     <div style={{ display: "flex", flexWrap: "wrap" }}>
//       {products.map((p) => (
//         <ProductCard key={p._id} product={p} onAdd={addToCart} />
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [purchased, setPurchased] = useState({});

  useEffect(() => {
    // products
    API.get("/products").then((res) => setProducts(res.data));

    // purchased docs
    API.get("/my-docs").then((res) => {
      const map = {};
      res.data.forEach((d) => {
        map[d.id] = true; // 🔥 FIX
      });
      setPurchased(map);
    });

    API.get("/cart").then((res) => {
      const map = {};
      res.data.items.forEach((item) => {
        map[item.productId._id] = true; // 🔥 FIX
      });
      setCart(map);
    });
  }, []);

  const toggleCart = async (id) => {
    try {
      if (cart[id]) {
        await API.post("/cart/remove", { productId: id });
        setCart((prev) => ({ ...prev, [id]: false }));
      } else {
        await API.post("/cart", { productId: id });
        setCart((prev) => ({ ...prev, [id]: true }));
      }
    } catch {
      alert("Login first");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Premium Notes Marketplace</h1>

      <div style={styles.grid}>
        {products.map((p) => {
          const isPurchased = purchased[p._id];
          const isInCart = cart[p._id];

          return (
            <div key={p._id} style={styles.card}>
              <h3 style={styles.title}>{p.title}</h3>
              <p style={styles.price}>₹{p.price}</p>

              <button
                disabled={isPurchased}
                style={{
                  ...styles.button,
                  opacity: isPurchased ? 0.6 : 1,
                  cursor: isPurchased ? "not-allowed" : "pointer",
                  background: isPurchased
                    ? "#444"
                    : isInCart
                    ? "linear-gradient(90deg, #ff4d4f, #ff7875)"
                    : "linear-gradient(90deg, #635bff, #00d4ff)",
                }}
                onClick={() => !isPurchased && toggleCart(p._id)}
              >
                {isPurchased
                  ? "Purchased ✅"
                  : isInCart
                  ? "Remove ❌"
                  : "Add to Cart 🛒"}
              </button>
            </div>
          );
        })}
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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "0.3s ease",
  },

  title: {
    fontSize: "18px",
    marginBottom: "10px",
  },

  price: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#00d4ff",
  },

  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s ease",
    color: "white",
  },
};