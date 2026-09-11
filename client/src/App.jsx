import React from 'react'
import {Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useGetCurrentUSer from './hooks/useGetCurrentUSer'
import { useSelector } from 'react-redux'
import DashBoard from './pages/DashBoard'
import Generate from './pages/Generate'
import WebEditor from './pages/WebEditor'
import Pricing from './pages/Pricing'
import LiveSite from './components/LiveSite'

export const serverUrl="https://websitebuilder-316c.onrender.com"
function App() {
  useGetCurrentUSer()
  const {userData}=useSelector(state=>state.user)
  return (
  <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/dashboard' element={userData?<DashBoard/>:<Home/>} />
    <Route path='/generate' element={userData?<Generate/>:<Home/>} />
    <Route path='/editor/:websiteId' element={userData?<WebEditor/>:<Home/>} />
    <Route path='/live-site/:websiteKey' element={<LiveSite/>} />
    <Route path='/pricing' element={<Pricing/>} />


  </Routes>
  )
}

export default App
