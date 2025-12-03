import React, { useState } from 'react'
import { login } from '../../services/auth/authService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { loginUser } = useAuth() // get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
  const res = await login(email, password)
  console.log("login response", res)

  // Correctly access tokens from the response
  loginUser(res.user, res.accessToken, res.refreshToken)

  toast.success(`Welcome back, ${res.user.email}!`, {
    position: "bottom-right",
    autoClose: 3000,
  })

  navigate("/")
} catch (err) {
  console.error(err)
  toast.error(err.response?.data?.message || "Login failed")
} finally {
      setLoading(false)
    }
  }

  return (
    <div className='py-50 flex items-center justify-center flex-col'>
      <p>Here you can log in</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="email"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='border px-2 py-1'
          required
        />
        <input
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='border px-2 py-1'
          required
        />
        <button
          type="submit"
          className='bg-primary text-cocoprimary py-2 rounded'
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Login
