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

export const verifyEmail = async (email, code) => {
  try {
    const response = await api.post('/auth/verify-email', { email, code });
    console.log("verifyEmail API response:", response.data);
    console.log("Response status:", response.status);
    return response.data;
  } catch (error) {
    console.error("verifyEmail API error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const logoutUser = () => api.post("/auth/logout");

export const checkIsAdmin = async () => {
  try {
    const response = await api.get('/permissions/is-admin');
    return response.data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw error;
  }
};