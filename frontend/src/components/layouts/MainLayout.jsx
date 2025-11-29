import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import Preloader from "../Preloader/Preloader";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // loader duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader show={loading} />

      {!loading && (
        <>
          <Navbar />
          <main className="px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </>
  );
};

export default MainLayout;
