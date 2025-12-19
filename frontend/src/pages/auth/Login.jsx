import React, { useState,useEffect } from 'react'
import {  login } from '../../services/auth/authService'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const { loginUser } = useAuth()
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate()
  

  const [throttleTime, setThrottleTime] = useState(0);
  useEffect(() => {
  const expiry = localStorage.getItem("loginThrottleExpiry");
    if (expiry) {
      const remaining = Math.floor((new Date(expiry).getTime() - Date.now()) / 1000);
      if (remaining > 0) setThrottleTime(remaining);
    }
  }, []);

  useEffect(() => {
    if (throttleTime <= 0) return;

    const interval = setInterval(() => {
      setThrottleTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("loginThrottleExpiry");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [throttleTime]);


  const handleSubmit = async (e) => {
  e.preventDefault()
  if (throttleTime > 0) return;

  setLoading(true)
  setErrors({})

  try {
    const res = await login(email, password)
    
    // Store user data AND get admin status from loginUser
    const loginResult = await loginUser(res.user, res.accessToken, res.refreshToken);
    
    // Show appropriate success message
    if (loginResult.isAdmin) {
      toast.success(`Welcome Admin ${res.user.firstName}!`, { 
        position: "top-right", 
        autoClose: 3000 
      });
      // Redirect admin to admin dashboard
      navigate("/admin", { replace: true });
    } else {
      toast.success(`Welcome back, ${res.user.firstName}!`, { 
        position: "top-right", 
        autoClose: 3000 
      });
      // Redirect regular user to home
      navigate("/", { replace: true });
    }
    
  } catch (err) {
    let message = "Wrong credentials"

    if (err.response?.status === 429) {
      message = "Too many requests, try again later";

      const ttl = import.meta.env.VITE_REQUEST_LOGIN_TIME;
      const expiryTime = new Date(Date.now() + ttl * 1000);
      localStorage.setItem("loginThrottleExpiry", expiryTime);
      setThrottleTime(ttl);

      const interval = setInterval(() => {
        setThrottleTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            localStorage.removeItem("loginThrottleExpiry");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    toast.error(message)
    setErrors({ global: message })
  } finally {
    setLoading(false)
  }
}



  const getInputClass = (fieldName) => {
    const baseClass = "field-input border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
    return errors[fieldName]
      ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-200`
      : baseClass
  }

  return (
    <div className="h-[92dvh] flex items-center justify-center flex-col px-4 pt-28">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl mb-4 font-semibold ultra-regular text-primary">Login</h1>

        {/* Email */}
        <div className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all`}
            required
          />
        </div>
        <div className="flex flex-col">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border border-black! rounded px-3 py-3 text-sm focus:ring-1 hover:ring-[1px] hover:ring-black/90 focus:ring-black/90 focus:outline-none transition-all`}
            required
          />
        </div>
        <p className='text-gray-900 text-sm -mt-2 font-bold'>You should have an account to order!</p>
        <p className='text-gray-500 text-sm -mt-3'>Don't have account? <Link to={'/signup'}> <span className='underline hover:no-underline'> Signup</span></Link></p>
        <p className='text-gray-500 text-sm -mt-3'> <Link to="/forgot-password" className='underline hover:no-underline'>Forget Password?</Link> </p>
        {errors.global && (
          <p className="text-red-500 text-sm mt-1">{errors.global}</p>
        )}
        <div className='w-full flex flex-row gap-2 mt-2'>
          <button
            type="submit"
            className="w-full bg-cocoprimary text-white py-2 rounded mt-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md hover:bg-cocoprimary/90"
            disabled={loading || throttleTime > 0}
          >
            {loading
            ? "Logging in..."
            : throttleTime > 0
            ? `Wait ${Math.floor(throttleTime / 60)}:${throttleTime % 60 < 10 ? '0' : ''}${throttleTime % 60} min`
            : "Login"}
          </button>
          <Link to="/signup" className="block w-full h-full">
          <button className="w-full bg-background text-primary border border-primary py-2 rounded mt-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md hover:bg-primary/5 ">
            Signup
          </button>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login
