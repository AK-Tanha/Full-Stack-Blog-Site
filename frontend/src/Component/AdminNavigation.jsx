import { useDispatch } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'
import adminImg from "../assets/admin.png"
import { useLogoutUserMutation } from '../redux/features/auth/authAPI'
import { logout } from '../redux/features/auth/authSlice'
import { 
  HiOutlineViewGrid, 
  HiOutlinePlusCircle, 
  HiOutlineTag, 
  HiOutlineCollection, 
  HiOutlineUsers, 
  HiOutlineLogout,
  HiOutlineHome
} from 'react-icons/hi'

const AdminNavigation = ({ onClose }) => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap()
      dispatch(logout())
    } catch (error) {
      console.error('logout unsuccessful', error)
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HiOutlineViewGrid, end: true },
    { name: 'Add New Post', path: '/dashboard/add-new-post', icon: HiOutlinePlusCircle },
    { name: 'Add Category', path: '/dashboard/add-category', icon: HiOutlineTag },
    { name: 'Manage Items', path: '/dashboard/manage-items', icon: HiOutlineCollection },
    { name: 'Manage Ads', path: '/dashboard/manage-ads', icon: HiOutlinePlusCircle },
    { name: 'Users', path: '/dashboard/users', icon: HiOutlineUsers },
  ]

  return (
    <div className="h-full bg-white border-r border-gray-100 flex flex-col shadow-2xl">
      {/* Brand & Profile Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <img src="/Logo.png" alt="Logo" className="h-8 md:h-10 w-auto" />
          <button onClick={onClose} className="lg:hidden p-2 bg-gray-100 rounded-full text-gray-500">
            <HiOutlineLogout className="rotate-180" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
          <div className="relative">
            <img src={adminImg} alt="Admin" className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-sm" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="font-black text-gray-900 text-xs md:text-sm leading-tight uppercase tracking-tight">Admin Room</p>
            <p className="text-[9px] md:text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">Control Center</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operations</p>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : 'text-gray-500 hover:bg-indigo-50/50 hover:text-indigo-600'}
              `}
            >
              <item.icon className={`text-xl transition-transform duration-300 group-hover:scale-110`} />
              <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Back to Site Button */}
        <div className="px-4 mt-8 pt-8 border-t border-gray-100">
            <Link 
              to="/" 
              className="flex items-center gap-3 px-4 py-3.5 text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-300 group"
            >
              <HiOutlineHome className="text-xl transition-transform group-hover:scale-110" />
              <span className="font-black text-xs uppercase tracking-widest">Back to Site</span>
            </Link>
        </div>
      </div>

      {/* Logout Section */}
      <div className="p-6 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all duration-300 active:scale-95 group shadow-sm"
        >
          <HiOutlineLogout className="text-xl transition-transform group-hover:-translate-x-1" />
          <span>Exit Session</span>
        </button>
      </div>
    </div>
  )
}

export default AdminNavigation


