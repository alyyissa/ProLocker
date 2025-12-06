import api from "../api"

export const getSize = async () => {
    try {
        const response = await api.get("/sizes")
        return response.data
    } catch (error) {
        throw error
    }
} 