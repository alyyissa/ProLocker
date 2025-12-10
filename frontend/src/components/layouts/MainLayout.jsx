import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Outlet, useLocation } from "react-router-dom";
import Preloader from "../Preloader/Preloader";

const MainLayout = () => {
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  const loaderRoutes = ["/", "/products"]; 

  useEffect(() => {
    if (loaderRoutes.includes(pathname)) {
      setLoading(true);
      window.scrollTo(0, 0);

      const timer = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [pathname]);

  return (
      <>
        {loading && <Preloader show={true} />}
        <main key={pathname}>
        <Navbar />
          <Outlet />
          <a
          href="https://wa.me/96170915687"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.1 1.52 5.88L0 24l6.33-1.53A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.24-6.2-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.43l-.37-.22-3.77.91.99-3.68-.24-.38A9.957 9.957 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.12-7.92c-.25-.12-1.47-.73-1.7-.81-.23-.08-.4-.12-.57.12-.17.24-.65.81-.8.97-.15.16-.31.18-.56.06-.25-.12-1.05-.38-2-1.24-.74-.66-1.24-1.48-1.39-1.72-.14-.24-.02-.37.11-.49.11-.11.25-.28.37-.42.12-.14.16-.24.25-.4.08-.16.04-.3-.02-.42-.06-.12-.57-1.37-.78-1.87-.2-.5-.41-.43-.57-.44-.15-.01-.32-.01-.49-.01s-.42.06-.64.3c-.22.24-.84.82-.84 2s.86 2.33.98 2.5c.12.16 1.7 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.19 1.1.16 1.51.1.46-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.46-.28z" />
          </svg>
        </a>
        <Footer />
        </main>
      </>
  );
};

export default MainLayout;
