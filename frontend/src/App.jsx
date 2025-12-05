import { useEffect, useState } from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import '@fortawesome/fontawesome-free'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Profile from './pages/auth/Profile'
import AOS from 'aos'
import GuestOnly from './pages/auth/GuestOnly'
import ProductsLayout from './components/layouts/ProductsLayout'
import Products from './components/Products'

function App() {
  useEffect(() =>{
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
      mirror: false,
    })
  }, [])
  return (
    <>
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={
          <GuestOnly>
            <Login/>
          </GuestOnly>
          }/>
        <Route path='/signup' element={
          <GuestOnly>
            <Signup/>
          </GuestOnly>
        }/>
        <Route path='/profile' element={<Profile />}/>
          <Route element={<ProductsLayout/>}>
            <Route path='/products' element={<Products />}/>
          </Route>
      </Route>

    </Routes>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </>
  )
}

export default App
