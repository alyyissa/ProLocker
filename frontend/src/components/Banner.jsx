import React from 'react'

const Banner = ({ text }) => {
  if (!text) return null;

  return (
    <div className="bg-cocoprimary  h-12 py-3 gap-4 fixed top-0 z-99 w-full">
      <div className="flex items-center justify-center text-center relative">
        <p className="text-[15px] text-white font-medium pr-6 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

export default Banner
