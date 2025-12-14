import React, { useEffect, useState, useRef } from 'react'
import {Link, useLocation, useNavigate } from "react-router-dom"
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext';
import SideCart from './cart/SideCart';
import { useCart } from '../context/CartContext';
import SearchBar from './home/SearchBar';


const Navbar = ({bannerExists}) => {

  const [placeholder, setPlaceholder] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [openCart, setOpenCart] = useState(false)
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const { isLoggedIn, logoutUser } = useAuth();

  const navigate = useNavigate();

  const topClass = bannerExists ? "top-8" : "top-0";

  const handleLogout = async () => {
    try {
      await logoutUser()
      setUserDropdown(false)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  };

  const {cart} = useCart();

  const handleCart = () => {
    setOpenCart(!openCart)
  }
  
  useEffect(() => {
    setOpenCart(false);
  }, [location.pathname]);

  // for the scroll
  useEffect(() => {
    function onScroll(){
      setScrolled(window.scrollY > 10)
    }
    onScroll();
    window.addEventListener("scroll", onScroll, {passive:true})
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // for not viewing the sidebar on large screen
  useEffect(()=> {
    function onResize(){
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  },[])

  useEffect(() => {
  const handleClickOutside = (event) => {
    const isProfileButton = event.target.closest('[data-profile-button="true"]');
    
    if (dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !isProfileButton) {
      setUserDropdown(false);
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  return (
    <>
      <div className={`w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 hover:bg-cocoprimary fixed ${topClass} py-5 md:py-8 z-60 transition-colors duration-300
        ${!isHome || scrolled || open ? "bg-cocoprimary" : "bg-transparent"}`}>
          <div className='flex flex-row items-center justify-between'>
            <button onClick={() => setOpen(!open)} aria-label="Close menu" className='md:hidden'>
                  <i className="fa-solid fa-bars text-xl cursor-pointer text-background"></i>
            </button>
            <aside
              className={`fixed top-0 left-0 h-full w-62 pt-18 bg-cocoprimary z-90 p-6 shadow-xl transform transition-transform duration-300 md:hidden
              ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
              <button 
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="absolute top-6 left-5 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-2xl text-background"></i>
              </button>

              <ul className="space-y-4 text-background font-semibold">
                <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
                <li><Link to="/products" onClick={() => setOpen(false)}>Products</Link></li>
                <li><Link to="/sale" onClick={() => setOpen(false)}>Sale</Link></li>
                <li><Link to="/latest" onClick={() => setOpen(false)}>Latest Products</Link></li>
              </ul>
            </aside>
            {open && (
              <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              ></div>
            )}
            <Link to={"/"}>
              <img src={assets.logo} className='w-60'/>
            </Link>
            <div className="relative text-gray-600 md:block hidden ">
              <SearchBar/>
            </div>

            <div className='flex flex-row items-center gap-5 relative'>
              {/* Profile Icon */}
              <button className="md:block hidden cursor-pointer" to="#" onClick={(e) =>{e.preventDefault(); setUserDropdown(!userDropdown)}} data-profile-button="true">
                <i className={`fa-solid fa-user fa-lg transition-colors duration-300 text-background`}></i>
              </button>

              {/* User Dropdown */}
              {userDropdown && (
                <ul ref={dropdownRef} className="absolute right-0 top-12 w-40 bg-white rounded-md shadow-lg divide-y divide-gray-200 z-50">
                  {isLoggedIn ? (
                    <>
                      <li>
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserDropdown(false)}>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserDropdown(false)}>
                        Sign In
                      </Link>
                    </li>
                  )}
                </ul>
              )}

              <Link onClick={(e) => {e.preventDefault(); handleCart()}}>
                <i className={`fa-solid fa-cart-shopping fa-lg transition-colors duration-300 text-background`}></i>
                <span className={`relative font-semibold text-[0.7rem] -left-0.5 -bottom-[3px] transition-colors duration-300 text-background`}>
                  {cart.length}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {isHome && (
          <div className='w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 bg-transparent fixed top-0 pt-20 z-50 flex md:hidden justify-center'>
            <SearchBar/>
          </div>
        )}
        {openCart && <SideCart show={openCart} onClose= {() => setOpenCart(false)}/>}
    </>
  )
}

export default Navbar
