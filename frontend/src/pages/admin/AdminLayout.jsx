import AdminNavigation from '../../Component/AdminNavigation'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { HiMenuAlt2, HiX } from 'react-icons/hi'

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/log-in" />
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-6 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-3 bg-white shadow-xl rounded-2xl text-gray-900 border border-gray-100 active:scale-95 transition-all"
        >
          {isSidebarOpen ? <HiX size={24} /> : <HiMenuAlt2 size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-72 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminNavigation onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="lg:ml-72 transition-all duration-300">
        <div className="px-4 py-8 md:p-8 lg:p-10 pt-20 lg:pt-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

