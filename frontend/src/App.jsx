import { useState } from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import '@fortawesome/fontawesome-free'

function App() {

  return (
    <Routes>

      <Route element={<MainLayout/>}>
        <Route path='/' element={<Home/>}/>
      </Route>

    </Routes>
  )
}

export default App
