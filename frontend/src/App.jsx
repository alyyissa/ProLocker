import { useState } from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import '@fortawesome/fontawesome-free'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Profile from './pages/auth/Profile'

function App() {

  return (
    <>
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/profile' element={<Profile />}/>
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
