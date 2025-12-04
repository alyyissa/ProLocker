import api from '../api'

export const login = async (email, password) => {
    const res = await api.post("/auth/login", {email, password})
    return res.data
};

export const signup = async(data) =>{
    const res = await api.post("/auth/signup", data)
    return res.data
}
export const resendCode = (email) => api.post("/auth/resend-code", { email });

export const verifyEmail = (email, code) =>  api.post("/auth/verify-email", { email, code });