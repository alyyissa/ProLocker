import api from "../api"

export const getCategories = async () => {
    try{
        const response = await api.get("/categories")
        return response.data
    }catch(err){
        console.log("Failed to fetch categories")
        throw err
    }
}