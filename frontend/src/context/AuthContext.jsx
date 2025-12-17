import { createContext, useContext, useState, useEffect } from "react";
import { logoutUser as logoutApi } from "../services/auth/authService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const storedUser = localStorage.getItem("user");
        
        if (storedUser && storedUser.trim() !== "") {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && 
                typeof parsedUser === 'object' && 
                accessToken && 
                refreshToken) {
              setUser(parsedUser);
            } else {
              clearAuthData();
            }
          } catch (parseError) {
            clearAuthData();
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        clearAuthData();
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const loginUser = (userData, accessToken, refreshToken) => {
    try {
      if (!userData || !accessToken || !refreshToken) {
        throw new Error("Invalid login data");
      }
      
      const userJson = JSON.stringify(userData);
      localStorage.setItem("user", userJson);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(userData);
      
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logoutApi();
      toast.success("Come Back Soon.")
    } catch (err) {
      console.error("Logout API error:", err);
      toast.error("Logout failed. Please try again.");
    } finally {
      clearAuthData();
    }
  };

  const isLoggedIn = !!user;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);