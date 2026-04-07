import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    API.get(`/verify-email?token=${token}`)
      .then(() => alert("Email Verified ✅"))
      .catch(() => alert("Invalid or expired token"));
  }, []);

  return <h2>Verifying Email...</h2>;
}