import { createContext, useContext, useState, useEffect } from "react";
import { logoutUser as logoutApi, checkIsAdmin  } from "../services/auth/authService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  const verifyAdminStatus = async (currentUser = user) => {
  if (!currentUser) {
    setIsAdmin(false);
    return false;
  }

  setIsCheckingAdmin(true);
  try {
    
    const data = await checkIsAdmin();
    const isUserAdmin = Boolean(data.isAdmin);
    
    setIsAdmin(isUserAdmin);
    localStorage.setItem("isAdmin", isUserAdmin.toString());
    
    return isUserAdmin;
  } catch (error) {
    console.error("Error verifying admin status:", error);
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    return false;
  } finally {
    setIsCheckingAdmin(false);
  }
};

  useEffect(() => {
  const initializeAuth = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");

      // No auth data → logged out
      if (!storedUser || !accessToken || !refreshToken) {
        clearAuthData();
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser || typeof parsedUser !== "object") {
        clearAuthData();
        return;
      }

      // ✅ Set user immediately
      setUser(parsedUser);

      // 🔥 BLOCKING admin verification (NO timeout)
      await verifyAdminStatus(parsedUser);

    } catch (error) {
      clearAuthData();
    } finally {
      // 🔒 Auth + admin status is now resolved
      setIsInitializing(false);
    }
  };

  initializeAuth();
}, []);


  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    setUser(null);
    setIsAdmin(false);
  };

  const loginUser = async (userData, accessToken, refreshToken) => {
  try {
    if (!userData || !accessToken || !refreshToken) {
      throw new Error("Invalid login data");
    }
    
    const userJson = JSON.stringify(userData);
    localStorage.setItem("user", userJson);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    
    // Set user state first
    setUser(userData);
    
    console.log('AuthContext: User set, checking admin status for user ID:', userData.id);
    
    // Check admin status after login - PASS the userData directly
    const adminStatus = await verifyAdminStatus(userData);
    
    console.log('AuthContext: loginUser returning isAdmin:', adminStatus);
    
    return { user: userData, isAdmin: adminStatus };
    
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

  const refreshAdminStatus = async () => {
    return await verifyAdminStatus();
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
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn, 
      isAdmin,
      isCheckingAdmin,
      loginUser, 
      logoutUser,
      refreshAdminStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);