import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Outlet, useLocation } from "react-router-dom";
import Preloader from "../Preloader/Preloader";

const MainLayout = () => {
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  const loaderRoutes = ["/",]; 

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
        <Navbar />
        <main key={pathname}>
          <Outlet />
        </main>
        <Footer />
      </>
  );
};

export default MainLayout;
