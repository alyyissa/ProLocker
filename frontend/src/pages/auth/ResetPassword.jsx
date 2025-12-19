import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const token = searchParams.get("token");
    const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

if (!token) {
  toast.error("Password Changed Successfully");
  navigate("/", { replace: true });
  return null;
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (password !== confirm)
      return toast.error("Passwords do not match");

    try {
  setLoading(true);

  const { data } = await api.post("/auth/reset-password", {
    token,
    newPassword: password,
  });

  // AUTO LOGIN
  login(data.user, data.accessToken, data.refreshToken);

  toast.success("Welcome back 👋 Password reset successfully");

  // Redirect away from token URL
  navigate("/", { replace: true }); // homepage or dashboard
} catch (err) {
  toast.success("Password reset successfully. Login now!!");
  navigate("/login", { replace: true });
} finally {
  setLoading(false);
}
  };

  return (
    <div className="h-[92dvh] flex items-center justify-center flex-col px-4 pt-28">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-3"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4"
        />

        <button
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
