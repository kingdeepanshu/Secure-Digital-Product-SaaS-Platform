// import { Link, useNavigate } from "react-router-dom";
// import { setAuthToken } from "../services/api";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const logout = () => {
//     localStorage.removeItem("token");
//     setAuthToken(null);
//     navigate("/login");
//   };

//   return (
//     <nav style={{
//       display: "flex",
//       justifyContent: "space-between",
//       padding: "10px",
//       background: "#222",
//       color: "#fff"
//     }}>
//       <Link to="/">Home</Link>

//       <div>
//         {token ? (
//           <>
//             <Link to="/cart" style={{ margin: "10px" }}>Cart</Link>
//             <Link to="/my-docs" style={{ margin: "10px" }}>My Docs</Link>
//             <button onClick={logout}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" style={{ margin: "10px" }}>Login</Link>
//             <Link to="/register">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      {/* LEFT */}
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>⚡ NotesSaaS</Link>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <Link to="/" style={styles.link}>Home</Link>

        {token && (
          <>
            <Link to="/cart" style={styles.link}>Cart 🛒</Link>
            <Link to="/my-docs" style={styles.link}>My Docs</Link>
          </>
        )}

        {token ? (
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ================= STYLES =================

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "rgba(10,12,27,0.7)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  left: {
    display: "flex",
    alignItems: "center",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "700",
    textDecoration: "none",
    background: "linear-gradient(90deg, #635bff, #00d4ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  link: {
    textDecoration: "none",
    color: "#ccc",
    fontSize: "14px",
  },

  registerBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    background: "linear-gradient(90deg, #635bff, #00d4ff)",
    color: "white",
    fontWeight: "600",
  },

  logoutBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "rgba(255,77,79,0.2)",
    color: "#ff4d4f",
    fontWeight: "600",
  },
};