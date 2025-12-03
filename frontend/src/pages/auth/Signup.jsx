import React, { useState } from "react";
import { signup } from "../../services/auth/authService";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await signup({ firstName, lastName, email, password });
      alert("Signup successful! You can now log in.");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[80dvh] flex items-center justify-center flex-col px-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
        <div className="items-start">
          <h1 className="text-2xl mb-4 font-semibold">Signup</h1>
        </div>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="field-input"
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="field-input"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-input"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="field-input"
          required
        />

        <button
          type="submit"
          className="bg-black text-white py-2 rounded mt-2 hover:bg-gray-900 transition"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

      </form>
    </div>
  );
};

export default Signup;
