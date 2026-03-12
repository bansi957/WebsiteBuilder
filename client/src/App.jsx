import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
export const serverUrl="http://localhost:3000"
function App() {
  return (
  <Routes>
    <Route path='/' element={<Home/>} />
  </Routes>
  )
}

export default App
