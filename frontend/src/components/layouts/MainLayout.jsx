import React, { Children } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'

const MainLayout = ({children}) => {
  return (
    <>
        <Navbar />
            <main className='px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 max-w-7xl'>
                {children}
            </main>
        <Footer />
    </>
  )
}

export default MainLayout
