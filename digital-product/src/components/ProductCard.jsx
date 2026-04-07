export default function ProductCard({ product, onAdd }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "15px",
      margin: "10px",
      width: "200px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h3>{product.title}</h3>
      <p>₹{product.price}</p>

      <button onClick={() => onAdd(product._id)}>
        Add to Cart 🛒
      </button>
    </div>
  );
}