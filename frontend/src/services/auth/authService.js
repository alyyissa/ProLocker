import api from './api'

export const login = async (ElementInternals, password) => {
    const res = await api.post("/auth/login", {email, password})
    return res.data
};

export const signup = async(data) =>{
    const res = await api.post("/auth/sigup", data)
    return res.data
}