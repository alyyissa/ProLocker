import api from '../api'

export const getProducts = async (page = 1, limit = 12) =>{
    const response = await api.get("/products", {
        params: {page, limit}
    })
    return response.data
}
