import React, { useState } from 'react'
import { login } from '../../services/auth/authService'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const res = await login(email,password);
            console.log("login response", res)

            alert ("login success");

            localStorage.setItem("token", res.access_token)
        }catch(err){
            console.error(err);
            alert("Login failed")
        }
    }
    return (
        <div className='h-screen py-50 flex items-center justify-center flex-col'>
            <p>Here you can logIn</p>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='border px-2 py-1'
                />
                <input
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='border px-2 py-1'
                />
                <button
                type="submit"
                className='bg-primary text-cocoprimary py-2 rounded'
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login
