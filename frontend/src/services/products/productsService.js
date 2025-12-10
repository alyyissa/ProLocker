import api from '../api'

export const getProducts = async (filters= {} ,page = 1, limit = 12) =>{
    const params = {...filters, page, limit}
    const response = await api.get("/products", {
        params
    })
    return response.data
}

export const getProductBySlug = async (slug) => {
    try {
        const response = await api.get(`/products/${slug}`)
        return response.data
    } catch (error) {
        throw error
    }
}