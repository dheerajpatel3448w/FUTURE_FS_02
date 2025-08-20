import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
function Applayout() {
  return (
    <div className='min-h-screen w-full max-w-full overflow-x-hidden flex flex-col'>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Applayout
