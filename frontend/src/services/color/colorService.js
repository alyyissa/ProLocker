import api from "../api"

export const getColors = async () => {
    try {
        const response = await api.get("/colors")
        return response.data
    } catch (error) {
        throw error
    }
}

