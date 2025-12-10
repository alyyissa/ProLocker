import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer class="bg-cocoprimary text-white pt-8 pb-3 tracking-wide">
      <div class="text-center flex flex-col items-center">
        <img src={assets.logo} className='md:w-70 w-50'/>
        <div class="mt-6">
          <h6 class="text-[15px] text-slate-300">Stay connected with us:</h6>

            <ul class="flex flex-wrap justify-center gap-x-6 ga-y-3 gap-4 mt-6">
                <li>
                <a href='https://www.facebook.com/lotfi.haidar/?locale=hr_HR' target='_blank'>
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-blue-600 w-8 h-8" viewBox="0 0 49.652 49.652">
                    <path d="M24.826 0C11.137 0 0 11.137 0 24.826c0 13.688 11.137 24.826 24.826 24.826 13.688 0 24.826-11.138 24.826-24.826C49.652 11.137 38.516 0 24.826 0zM31 25.7h-4.039v14.396h-5.985V25.7h-2.845v-5.088h2.845v-3.291c0-2.357 1.12-6.04 6.04-6.04l4.435.017v4.939h-3.219c-.524 0-1.269.262-1.269 1.386v2.99h4.56z" data-original="#000000" />
                    </svg>
                </a>
                </li>
                <li>
                <a href='https://www.instagram.com/pro.locker/' target='_blank'>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 152 152">
                    <linearGradient id="a" x1="22.26" x2="129.74" y1="22.26" y2="129.74" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#fae100" />
                        <stop offset=".15" stop-color="#fcb720" />
                        <stop offset=".3" stop-color="#ff7950" />
                        <stop offset=".5" stop-color="#ff1c74" />
                        <stop offset="1" stop-color="#6c1cd1" />
                    </linearGradient>
                    <g data-name="Layer 2">
                        <g data-name="03.Instagram">
                        <rect width="152" height="152" fill="url(#a)" data-original="url(#a)" rx="76" />
                        <g fill="#fff">
                            <path fill="#ffffff10" d="M133.2 26c-11.08 20.34-26.75 41.32-46.33 60.9S46.31 122.12 26 133.2q-1.91-1.66-3.71-3.46A76 76 0 1 1 129.74 22.26q1.8 1.8 3.46 3.74z" data-original="#ffffff10" />
                            <path d="M94 36H58a22 22 0 0 0-22 22v36a22 22 0 0 0 22 22h36a22 22 0 0 0 22-22V58a22 22 0 0 0-22-22zm15 54.84A18.16 18.16 0 0 1 90.84 109H61.16A18.16 18.16 0 0 1 43 90.84V61.16A18.16 18.16 0 0 1 61.16 43h29.68A18.16 18.16 0 0 1 109 61.16z" data-original="#ffffff" />
                            <path d="m90.59 61.56-.19-.19-.16-.16A20.16 20.16 0 0 0 76 55.33 20.52 20.52 0 0 0 55.62 76a20.75 20.75 0 0 0 6 14.61 20.19 20.19 0 0 0 14.42 6 20.73 20.73 0 0 0 14.55-35.05zM76 89.56A13.56 13.56 0 1 1 89.37 76 13.46 13.46 0 0 1 76 89.56zm26.43-35.18a4.88 4.88 0 0 1-4.85 4.92 4.81 4.81 0 0 1-3.42-1.43 4.93 4.93 0 0 1 3.43-8.39 4.82 4.82 0 0 1 3.09 1.12l.1.1a3.05 3.05 0 0 1 .44.44l.11.12a4.92 4.92 0 0 1 1.1 3.12z" data-original="#ffffff" />
                        </g>
                        </g>
                    </g>
                    </svg>
                </a>
                </li>
                <li>
                <a 
                    href="https://www.tiktok.com/@pro.locker" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center bg-black rounded-full"
                >
                    <i className="fa-brands fa-tiktok text-white text-lg"></i>
                </a>
                </li>
            </ul>
        </div>

        <div class="border-t border-gray-600 pt-6 mt-6">
          <p class="text-[15px] text-slate-300">© ReadymadeUI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
