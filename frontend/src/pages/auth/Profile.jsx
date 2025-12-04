import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';


const Profile = () => {
  const { logoutUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      logoutUser();

      window.location.href = "/login";

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className='h-screen pt-40'>
      <button
        className='p-4 bg-black text-background cursor-pointer'
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}

export default Profile
