import { useEffect, useState } from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import '@fortawesome/fontawesome-free'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AOS from 'aos'
import GuestOnly from './pages/auth/GuestOnly'
import Product from './pages/Product'
import Checkout from './pages/Checkout'
import ProductView from './pages/ProductView'
import Profile from './pages/Profile'
import AdminLayout from './components/layouts/AdminLayout'
import Orders from './components/admin/Orders'
import Products from './components/admin/Products'
import Categories from './components/admin/Categories'

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
        <Route path='/products' element={<Product />}/>
        <Route path='/checkout' element={<Checkout />}/>
        <Route path='/products/:slug' element={<ProductView />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element/>
        <Route path="orders" element={<Orders />} />
        <Route path='products' element={<Products />}/>
        <Route path='category' element={<Categories />}/>
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
