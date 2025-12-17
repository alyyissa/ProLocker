import React, { useState, useEffect } from "react";
import { signup } from "../../services/auth/authService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import VerifyPopup from "../../components/VerifyPopup";

const Signup = () => {
  const { loginUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    else if (formData.firstName.length < 2) newErrors.firstName = "First name must be at least 2 characters";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (formData.lastName.length < 2) newErrors.lastName = "Last name must be at least 2 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) element.focus();
      return;
    }

    setLoading(true);

    try {
      await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Verification code sent! Check your email.");

      setPendingEmail(formData.email.trim());
      setShowVerifyPopup(true);
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message?.toLowerCase().includes("email")) {
        setErrors({ email: err.response.data.message });
      } else {
        alert(err.response?.data?.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const baseClass = "field-input";
    return errors[fieldName]
      ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-200`
      : baseClass;
  };

  return (
    <div className="h-[93dvh] flex items-center justify-center flex-col px-4 pt-28 relative">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
        <div className="items-start">
          <h1 className="text-2xl mb-4 font-bold ultra-regular text-primary">Signup</h1>
        </div>

        {/* First Name */}
        <div className="flex flex-col">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all"
            required
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all"
            required
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all"
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <p className="text-gray-500 text-xs mt-1">Must be at least 6 characters.</p>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all`}
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <div className="w-full flex flex-row gap-2 mt-2">
          <button
            type="submit"
            className="w-full bg-cocoprimary text-white py-2 rounded mt-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md hover:bg-cocoprimary/90"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>

          <Link to="/login" className="block w-full h-full">
            <button className="w-full bg-background text-primary border border-primary py-2 rounded mt-2 transition-all duration-200 hover:shadow-md hover:bg-primary/5 cursor-pointer">
              Login
            </button>
          </Link>
        </div>
      </form>

      {/* OTP Verification Popup */}
      {showVerifyPopup && (
        <VerifyPopup
          email={pendingEmail}
          onClose={() => setShowVerifyPopup(false)}
        />
      )}
    </div>
  );
};

export default Signup;
