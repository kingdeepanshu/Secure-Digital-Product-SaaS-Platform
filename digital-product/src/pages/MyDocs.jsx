import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyDocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/my-docs")
      .then((res) => {
        setDocs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Login required");
          window.location.href = "/login";
        } else {
          setError("Failed to load documents");
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <h2 style={styles.loading}>Loading your documents...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <h2 style={styles.empty}>{error}</h2>
      </div>
    );
  }

  if (!docs || docs.length === 0) {
    return (
      <div style={styles.center}>
        <h2 style={styles.empty}>No purchases yet 📭</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Purchases</h1>

      <div style={styles.grid}>
        {docs.map((d) => {
          // safe destructuring
          const id = d._id || d.productId;
          const title = d.title;
          const downloadLink = d.downloadLink;

          if (!title || !downloadLink) return null;

          return (
            <div key={id} style={styles.card}>
              <div>
                <h3 style={styles.title}>{title}</h3>
                <p style={styles.desc}>Premium digital notes</p>
              </div>

              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.downloadBtn}
              >
                Download ⬇️
              </a>
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
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
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
    transition: "0.3s ease",
  },

  title: {
    fontSize: "18px",
    marginBottom: "5px",
  },

  desc: {
    fontSize: "13px",
    color: "#aaa",
  },

  downloadBtn: {
    padding: "10px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    background: "linear-gradient(90deg, #635bff, #00d4ff)",
    color: "white",
    fontWeight: "600",
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