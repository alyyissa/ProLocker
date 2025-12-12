import { createContext, useContext, useState, useEffect } from "react";
import { logoutUser as logoutApi} from "../services/auth/authService";

  const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");
      if (accessToken && storedUser && refreshToken) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

    const loginUser = (userData, accessToken, refreshToken) => {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(userData);
    };

    const logoutUser = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

    const isLoggedIn = !!user;

    return (
      <AuthContext.Provider value={{ user, isLoggedIn, loginUser, logoutUser }}>
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => useContext(AuthContext);
