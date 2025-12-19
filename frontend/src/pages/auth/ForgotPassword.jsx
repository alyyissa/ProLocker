import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });

      toast.success("If the email exists, a reset link was sent 📩");
      setEmail("");
    } catch (err) {
      toast.success("If the email exists, a reset link was sent 📩");
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Enter your email to receive a reset link
        </p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring"
        />

        <button
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Remembered your password?
          <Link to="/login" className="underline ml-1">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
