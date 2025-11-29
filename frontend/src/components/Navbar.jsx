import React from 'react'
import {Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className='w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 bg-cocoprimary fixed top-0 py-8'>
        <div className='flex flex-row items-center justify-between'>
          <img src="" alt="" />
          <div className="relative text-gray-600">
            <input type="search" name="serch" placeholder="Search" className=" h-10 px-20 py-5 rounded-full text-md focus:outline-none bg-gray-200"/>
            <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
              <svg className="h-4 w-4 fill-current" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
              </svg>
            </button>
          </div>

          <div className='flex flex-row items-center gap-5'>
            <Link><i className="fa-solid fa-user text-background fa-lg"></i></Link>
            <Link><i className="fa-solid fa-cart-shopping text-background fa-lg"></i> <span className='relative font-semibold text-[0.7rem] text-background -ml-1 bottom-0'>0</span></Link>
          </div>
        </div>
    </div>
  )
}

export default Navbar
