import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl mb-4 font-semibold ultra-regular text-primary">
          Forgot Password
        </h1>
        
        <p className="text-gray-500 text-sm -mt-3">
          Enter your email to receive a reset link
        </p>

        {/* Email Input */}
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Button */}
        <div className="w-full flex flex-row gap-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cocoprimary text-white py-2 rounded mt-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md hover:bg-cocoprimary/90"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;