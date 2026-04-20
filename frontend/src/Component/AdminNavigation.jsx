import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import adminImg from "../assets/admin.png"
import { useLogoutUserMutation } from '../redux/features/auth/authAPI'
import { logout } from '../redux/features/auth/authSlice'
import { 
  HiOutlineViewGrid, 
  HiOutlinePlusCircle, 
  HiOutlineTag, 
  HiOutlineCollection, 
  HiOutlineUsers, 
  HiOutlineLogout 
} from 'react-icons/hi'

const AdminNavigation = () => {
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
    { name: 'Users', path: '/dashboard/users', icon: HiOutlineUsers },
  ]

  return (
    <div className="h-full bg-white border-r border-gray-100 flex flex-col shadow-sm">
      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
          <div className="relative">
            <img src={adminImg} alt="Admin" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">Admin Portal</p>
            <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider mt-0.5">System Master</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 mb-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Menu</p>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon className={`text-xl transition-transform duration-200 group-hover:scale-110`} />
              <span className="font-semibold text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 font-bold text-sm bg-rose-50 hover:bg-rose-100 rounded-xl transition-all duration-200 active:scale-95 group"
        >
          <HiOutlineLogout className="text-xl transition-transform group-hover:-translate-x-1" />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  )
}

export default AdminNavigation


