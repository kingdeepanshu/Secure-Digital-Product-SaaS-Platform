import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  console.log(products);
  

  const addToCart = async (id) => {
    try {
      await API.post("/cart", { productId: id });
      alert("Added to cart 🛒");
    } catch {
      alert("Login first");
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((p) => (
        <ProductCard key={p._id} product={p} onAdd={addToCart} />
      ))}
    </div>
  );
}