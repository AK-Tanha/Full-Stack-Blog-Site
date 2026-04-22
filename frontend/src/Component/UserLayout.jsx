import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const UserLayout = () => {
  return (
    <div className='bg-bgPrimary min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow'>
        <Outlet />
      </div>
      <Footer/>
    </div>
  )
}

export default UserLayout
