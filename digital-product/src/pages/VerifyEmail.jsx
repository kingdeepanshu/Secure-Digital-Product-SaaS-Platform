// import { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import API from "../services/api";

// export default function VerifyEmail() {
//   const [params] = useSearchParams();

//   useEffect(() => {
//     const token = params.get("token");

//     API.get(`/verify-email?token=${token}`)
//       .then(() => alert("Email Verified ✅"))
//       .catch(() => alert("Invalid or expired token"));
//   }, []);

//   return <h2>Verifying Email...</h2>;
// }

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = params.get("token");

    API.get(`/verify-email?token=${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === "loading" && (
          <>
            <h2 style={styles.title}>Verifying Email...</h2>
            <p style={styles.subtitle}>Please wait a moment ⏳</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 style={styles.success}>Email Verified ✅</h2>
            <p style={styles.subtitle}>You can now login to your account</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 style={styles.error}>Verification Failed ❌</h2>
            <p style={styles.subtitle}>Invalid or expired token</p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top, #1a1f36, #0a0c1b)",
  },

  card: {
    width: "380px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
    color: "white",
  },

  title: {
    fontSize: "22px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#aaa",
  },

  success: {
    fontSize: "22px",
    color: "#00d4ff",
    marginBottom: "10px",
  },

  error: {
    fontSize: "22px",
    color: "#ff4d4f",
    marginBottom: "10px",
  },
};