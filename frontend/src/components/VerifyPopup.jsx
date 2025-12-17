import React, { useState, useEffect } from "react";
import { verifyEmail, resendCode } from "../services/auth/authService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {useNavigate } from 'react-router-dom'

const VerifyPopup = ({ email, onClose }) => {
  const navigate = useNavigate()
  const { loginUser } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((sec) => {
            if (sec <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
            }
            return sec - 1;
        });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async () => {
  try {
    setLoading(true);
    
    const code = otp.join("");
    console.log("Verifying with email:", email, "code:", code);
    
    const res = await verifyEmail(email, code);
    console.log("Full verification response:", res);
    
    // Check if res exists
    if (!res) {
      toast.error("No response from server");
      return;
    }
    if (res.user && res.accessToken && res.refreshToken) {
      loginUser(res.user, res.accessToken, res.refreshToken);
      console.log("loginUser called successfully");
      
      toast.success("Account verified successfully! Redirecting...");
      setTimeout(() => navigate('/'), 1000); // Give time for state to update
    } else {
      console.error("Missing required fields in response:", {
        hasUser: !!res.user,
        hasAccessToken: !!res.accessToken,
        hasRefreshToken: !!res.refreshToken
      });
      toast.error("Verification succeeded but login data is incomplete");
    }
  } catch (err) {
    console.error("Verification error details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    toast.error(err.response?.data?.message || "Verification failed");
  } finally {
    setLoading(false);
  }
};



    const handleResend = async () => {
        try {
        setResendDisabled(true);
        setTimer(60);

        await resendCode(email);
        toast.success("New code sent to your email");
        } catch {
        toast.error("Unable to resend code");
        }
    };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 text-center">
        <h2 className="text-xl font-semibold">Verify Your Email</h2>
            <p className="text-gray-600 mt-1">
                We sent a code to <strong>{email}</strong>
            </p>

        <div className="flex justify-center gap-2 mt-4">
            {otp.map((digit, i) => (
                <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-10 h-12 border rounded text-center text-xl focus:border-cocoprimary outline-none"
                />
            ))}
            </div>

            <button
            onClick={handleVerify}
            className="bg-cocoprimary text-white w-full py-2 rounded mt-4 cursor-pointer"
            disabled={loading}
            >
            {loading ? "Verifying..." : "Verify"}
            </button>

            <button
            onClick={handleResend}
            disabled={resendDisabled}
            className="mt-3 text-sm text-cocoprimary disabled:text-gray-400 cursor-pointer"
            >
            {resendDisabled ? `Resend in ${timer}s` : "Resend Code"}
            </button>
        </div>
    </div>
  );
};

export default VerifyPopup;
