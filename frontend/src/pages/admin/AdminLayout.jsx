import AdminNavigation from '../../Component/AdminNavigation'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/log-in" />
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Navigation - Synchronized with sticky navbar (h-28 approx) */}
      <aside className="w-full md:w-64 lg:w-72 md:fixed md:top-28 md:bottom-0 z-40">
        <AdminNavigation />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 lg:ml-72 transition-all duration-300">
        <div className="p-4 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
