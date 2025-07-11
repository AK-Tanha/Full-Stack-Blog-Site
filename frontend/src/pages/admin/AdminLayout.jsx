import AdminNavigation from '../../Component/AdminNavigation'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminLayout = () => {
    const {user} = useSelector((state) => state.auth);
    if (!user || user.role !== 'admin') {
        return <Navigate to="/log-in"/>
    }
  return (
    <div className='container mx-auto flex flex-col md:flex-row gap-4 items-start justify-start'>
      <header className='sm:w-1/5 md:w-2/5 w-full'>
        <AdminNavigation/>
      </header>
      <main className='p-8 bg-white w-full'>
        <p>Admin Content</p>
        <Outlet/>
      </main>
    </div>
  )
}

export default AdminLayout
