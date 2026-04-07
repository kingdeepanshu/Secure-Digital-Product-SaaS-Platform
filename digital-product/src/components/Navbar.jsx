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
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px",
      background: "#222",
      color: "#fff"
    }}>
      <Link to="/">Home</Link>

      <div>
        {token ? (
          <>
            <Link to="/cart" style={{ margin: "10px" }}>Cart</Link>
            <Link to="/my-docs" style={{ margin: "10px" }}>My Docs</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ margin: "10px" }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}