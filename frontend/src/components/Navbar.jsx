import React, { useEffect, useState } from 'react'
import {Link } from "react-router-dom"
import { assets } from '../assets/assets';

const placeholderTexts = [
  "What are you looking for?",
  "Search for the products you need",
  "Type and explore..."
]
const Navbar = () => {

  const [placeholder, setPlaceholder] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  // for the search bar loop
  useEffect(() => {
    const currentText = placeholderTexts[textIndex];
    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + currentText[charIndex]);
        setCharIndex(charIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setPlaceholder("");
        setCharIndex(0);
        setTextIndex((prev) => (prev + 1) % placeholderTexts.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, textIndex]);

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


  return (
    <>
      <div className={`w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 hover:bg-cocoprimary fixed top-0 py-5 md:py-8 z-60 transition-colors duration-300
        ${scrolled || open ? "bg-cocoprimary" : "bg-transparent"}`}>
          <div className='flex flex-row items-center justify-between'>
            {/** open index */}
            <button onClick={() => setOpen(!open)} aria-label="Close menu" className='md:hidden'>
                  <i className="fa-solid fa-bars text-xl cursor-pointer"></i>
            </button>
            <aside
              className={`fixed top-0 left-0 h-full w-62 pt-18 bg-background z-90 p-6 shadow-xl transform transition-transform duration-300 md:hidden
              ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
              <button 
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="absolute top-5 left-5 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>

              <ul className="space-y-4 text-gray-700 font-medium">
                <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
                <li><Link to="/products" onClick={() => setOpen(false)}>Products</Link></li>
                <li><Link to="/sale" onClick={() => setOpen(false)}>Sale</Link></li>
                <li><Link to="/latest" onClick={() => setOpen(false)}>Latest Products</Link></li>
              </ul>
            </aside>
            <img src={assets.logo} className='w-60'/>
            <div className="relative text-gray-600 md:block hidden ">
              <input type="search" name="serch" placeholder={placeholder} className={`
                pl-7 h-[45px] w-[400px] py-5 rounded-full text-md
                focus:outline-none
                bg-transparent backdrop-blur-md
                text-background
                placeholder-gray-300
                border border-gray-300
                ${scrolled ? "text-cocoprimary placeholder-gray-500 border-cocoprimary" : "text-background placeholder-gray-300 border-gray-300"}
                `}
              />
              <button type="submit" className="absolute right-0 top-0 mt-4 mr-4 text-background">
                <svg className="h-4 w-4 fill-current" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
                </svg>
              </button>
            </div>

            <div className='flex flex-row items-center gap-5'>
              <Link className="md:block hidden"><i className={`fa-solid fa-user fa-lg transition-colors duration-300 text-background`}></i></Link>
              <Link>
                <i className={`fa-solid fa-cart-shopping fa-lg transition-colors duration-300 text-background`}></i>
                
                <span className={`relative font-semibold text-[0.7rem] -left-0.5 -bottom-[3px] transition-colors duration-300 text-background`}>
                  0
                </span>
              </Link>
            </div>
          </div>
          <div>

          </div>
      </div>
      <div className='w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 bg-transparent fixed top-0 pt-20 z-50 block md:hidden'>
          <input type="search" name="search" placeholder={placeholder} className="
            pl-7 h-[45px] w-full py-5 rounded-full text-md
            focus:outline-none
            bg-transparent backdrop-blur-md
            text-background
            placeholder-gray-300
            border border-gray-300"
          />
      </div>
    </>
  )
}

export default Navbar


{/**
  
        <div class="search-field field field--no-border field--pill">
            <input id="Middle-Search" class="field-input" type="search" name="q" value="" placeholder="What are you looking for?" aria-label="Search the site" role="combobox" aria-haspopup="true" aria-expanded="false" aria-owns="Search-Container-Middle-Search" aria-controls="Search-Container-Middle-Search" aria-autocomplete="list" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
            <label class="field-label" for="Middle-Search">
                <typing-words data-text="What are you looking for?" data-interval="10">What are you looking for?</typing-words>
            </label>
            <input type="hidden" name="options[prefix]" value="last">
            <div class="field-button-group">
                <button type="reset" class="field-button reset-button hidden focus-inset">
                    Clear
                </button>
                <button class="field-button search-button focus-inset">
                    

<svg class="icon icon-search" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M12.6667 6C16.3485 6 19.3333 8.98477 19.3333 12.6667M20.2117 20.2065L26 26M23.3333 12.6667C23.3333 18.5577 18.5577 23.3333 12.6667 23.3333C6.77563 23.3333 2 18.5577 2 12.6667C2 6.77563 6.77563 2 12.6667 2C18.5577 2 23.3333 6.77563 23.3333 12.6667Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>

                    <span class="visually-hidden">Search</span>
                </button>
            </div>
        </div>

        <div id="Search-Container-Middle-Search" class="search-container color-scheme-80596d61-fceb-48b2-8292-def17f31afcd gradient">
            <div class="search-trending-main">
                <div class="popular-searches"><b class="keyword-heading">Popular searches</b>
                        <div class="keyword-list">
<a href="/search?q=Shoes" class="link link-text focus-inset hot" data-keyword="Shoes" aria-label="Search for Shoes">
                                        <span aria-hidden="true">Shoes</span>
                                    </a>
<a href="/search?q=Sneakers" class="link link-text focus-inset hot" data-keyword="Sneakers" aria-label="Search for Sneakers">
                                        <span aria-hidden="true">Sneakers</span>
                                    </a>
<a href="/search?q=Sportswear" class="link link-text focus-inset hot" data-keyword="Sportswear" aria-label="Search for Sportswear">
                                        <span aria-hidden="true">Sportswear</span>
                                    </a>
<a href="/search?q=Jackets" class="link link-text focus-inset" data-keyword="Jackets" aria-label="Search for Jackets">
                                        <span aria-hidden="true">Jackets</span>
                                    </a>
<a href="/search?q=Pants" class="link link-text focus-inset" data-keyword="Pants" aria-label="Search for Pants">
                                        <span aria-hidden="true">Pants</span>
                                    </a>
<a href="/search?q=Shorts" class="link link-text focus-inset" data-keyword="Shorts" aria-label="Search for Shorts">
                                        <span aria-hidden="true">Shorts</span>
                                    </a>
<a href="/search?q=Backpacks" class="link link-text focus-inset" data-keyword="Backpacks" aria-label="Search for Backpacks">
                                        <span aria-hidden="true">Backpacks</span>
                                    </a>
<a href="/search?q=Caps" class="link link-text focus-inset" data-keyword="Caps" aria-label="Search for Caps">
                                        <span aria-hidden="true">Caps</span>
                                    </a>
<a href="/search?q=Footballs" class="link link-text focus-inset" data-keyword="Footballs" aria-label="Search for Footballs">
                                        <span aria-hidden="true">Footballs</span>
                                    </a>
<a href="/search?q=Tennis Racquets" class="link link-text focus-inset" data-keyword="Tennis Racquets" aria-label="Search for Tennis Racquets">
                                        <span aria-hidden="true">Tennis Racquets</span>
                                    </a></div></div></div><div class="predictive-search-main">
                    <div class="search-results-wrapper">
                    </div>
                    <button type="submit" class="predictive-search-button button button--full-width button--hover-animate focus-inset">
                        Search page
                        

<svg class="icon icon-arrow-right" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M19.1788 13.5L5 13.5V15.5L19.1788 15.5L16.0615 18.6L17.4693 20L23 14.5L17.5698 9L16.162 10.4L19.1788 13.5Z" fill="currentColor" data-ltr=""></path>
          <path d="M8.82123 13.5L23 13.5V15.5L8.82123 15.5L11.9385 18.6L10.5307 20L5 14.5L10.4302 9L11.838 10.4L8.82123 13.5Z" fill="currentColor" data-rtl=""></path></svg>

                    </button>
                    <template id="Placeholder-Search-Form-sections--18920475885722__header">
                        <div class="search-loading-placeholder">
                            <ul class="tab-panel-tabs">
                                <li class="tab placeholder"></li>
                                <li class="tab placeholder"></li>
                                <li class="tab placeholder"></li>
                            </ul>
                            <div class="tab-panel-panels">
                                <div class="panel">
                                    <div class="placeholder"></div>
                                    <div class="placeholder"></div>
                                    <div class="placeholder"></div>
                                    <div class="placeholder"></div>
                                    <div class="placeholder"></div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <span class="predictive-search-status visually-hidden" role="status" aria-hidden="true"></span></div>
    
  */}