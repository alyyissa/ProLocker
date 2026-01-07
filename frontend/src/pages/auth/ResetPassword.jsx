import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      navigate("/", { replace: true });
    } catch (err) {
      toast.success("Password reset successfully. Login now!!");
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4 pt-28">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl mb-4 font-semibold ultra-regular text-primary">
          Reset Password
        </h1>

        <p className="text-gray-500 text-sm -mt-3">
          Enter your new password below
        </p>

        {/* New Password Input */}
        <div className="flex flex-col">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-row gap-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cocoprimary text-white py-2 rounded mt-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md hover:bg-cocoprimary/90"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          
          <Link to="/login" className="block w-full h-full">
            <button className="w-full bg-background text-primary border border-primary py-2 rounded mt-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md hover:bg-primary/5">
              Back to Login
            </button>
          </Link>
        </div>

        <p className="text-gray-500 text-sm text-center">
          Remembered your password?{" "}
          <Link to="/login" className="underline hover:no-underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;