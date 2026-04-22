import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { IoCloseSharp, IoMenuSharp } from "react-icons/io5";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import avatarImg from "../assets/commentor.png"
import { useLogoutUserMutation } from '../../src/redux/features/auth/authAPI';
import { logout } from '../../src/redux/features/auth/authSlice'

const navLists = [
  { name: "Home", path: "/" },
  { name: "About us", path: "/about-us" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Contact us", path: "/contact-us" },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const { user } = useSelector((state) => state.auth);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [logOutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const hanDelLogout = async () => {
    try {
      await logOutUser().unwrap();
      dispatch(logout());
    } catch (error) {
      // error handling
    }
  };

  return (
    <header className='bg-white z-50 sticky top-0 border-b border-gray-100 shadow-sm'>
      {/* Top Bar */}
      <div className='hidden md:block bg-gray-900 text-white py-2 text-xs font-medium'>
        <div className='container mx-auto flex justify-between items-center px-5'>
          <div className='flex items-center gap-4'>
            <span>{currentDate}</span>
            <span className='h-3 w-[1px] bg-gray-700'></span>
            <span className='hover:text-blue-400 cursor-pointer transition-colors'>Trending Now</span>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-gray-400'>Follow Us:</span>
            <div className='flex items-center gap-3'>
              <FaFacebookF className='hover:text-blue-500 cursor-pointer transition-colors' />
              <FaTwitter className='hover:text-blue-400 cursor-pointer transition-colors' />
              <FaInstagram className='hover:text-pink-500 cursor-pointer transition-colors' />
              <FaYoutube className='hover:text-red-600 cursor-pointer transition-colors' />
            </div>
          </div>
        </div>
      </div>

      <nav className='container mx-auto flex justify-between items-center px-5 py-4'>
        {/* Logo */}
        <Link to="/" className='flex items-center group'>
          <img src="/Logo.png" alt="Combat Corner Logo" className='h-12 w-auto object-contain' />
        </Link>

        {/* Desktop Menu */}
        <ul className='hidden lg:flex items-center gap-8'>
          {navLists.map((list, index) => (
            <li key={index}>
              <NavLink
                to={list.path}
                className={({ isActive }) =>
                  `text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-600 after:transition-all hover:after:w-full ${
                    isActive ? "text-orange-600 after:w-full" : "text-gray-900 hover:text-orange-600"
                  }`
                }>
                {list.name}
              </NavLink>
            </li>
          ))}

          <div className='h-6 w-[1px] bg-gray-200 mx-2'></div>

          {user ? (
            <li className='flex items-center gap-6'>
              <div className='flex items-center gap-3'>
                <div className='relative group cursor-pointer'>
                  <img 
                    src={user.profileImage || avatarImg} 
                    alt="avatar" 
                    className='w-10 h-10 rounded-full border-2 border-transparent group-hover:border-orange-600 transition-all object-cover' 
                  />
                  <div className='absolute hidden group-hover:block top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-50 overflow-hidden z-[100]'>
                    <Link to="/profile" className='block px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors'>
                      My Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/dashboard" className='block px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-t border-gray-50'>
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={hanDelLogout}
                      className='w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50'
                    >
                      Logout
                    </button>
                  </div>
                </div>
                <div className='hidden xl:block'>
                   <p className='text-[10px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1'>{user.username}</p>
                   <p className='text-[8px] font-bold text-orange-600 uppercase tracking-widest opacity-70'>{user.role}</p>
                </div>
              </div>
            </li>
          ) : (
            <li>
              <NavLink
                to="/log-in"
                className='bg-orange-600 text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 hover:shadow-orange-200'>
                Sign In
              </NavLink>
            </li>
          )}
        </ul>

        {/* Toggle Menu Button */}
        <div className='lg:hidden'>
          <button
            onClick={toggleMenu}
            className='text-gray-900 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200'>
            {isMenuOpen ? <IoCloseSharp className='w-6 h-6' /> : <IoMenuSharp className='w-6 h-6' />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className='p-8 flex flex-col h-full'>
            <div className='flex items-center justify-between mb-12'>
              <img src="/Logo.png" alt="Combat Corner Logo" className='h-10 w-auto object-contain' />
              <button onClick={() => setIsMenuOpen(false)} className='p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors'><IoCloseSharp /></button>
            </div>

            <ul className='flex flex-col gap-8 mb-auto'>
              {navLists.map((list, index) => (
                <li key={index}>
                  <NavLink
                    to={list.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-black uppercase tracking-widest ${isActive ? "text-orange-600" : "text-gray-900"}`
                    }>
                    {list.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className='mt-10 pt-10 border-t border-gray-100'>
              {user ? (
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-4'>
                    <img src={user.profileImage || avatarImg} alt="avatar" className='w-14 h-14 rounded-full border-2 border-orange-600 shadow-md object-cover' />
                    <div>
                      <p className='font-black text-gray-900 uppercase tracking-tight'>{user.username}</p>
                      <p className='text-xs text-orange-600 font-bold uppercase tracking-widest'>{user.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link to="/profile" className='w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm text-center shadow-lg' onClick={() => setIsMenuOpen(false)}>
                      View Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/dashboard" className='w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm text-center shadow-lg shadow-orange-100' onClick={() => setIsMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                  </div>
                  <button onClick={hanDelLogout} className='w-full py-4 border-2 border-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-50 transition-colors'>
                    Log Out
                  </button>
                </div>
              ) : (
                <NavLink to="/log-in" className='w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-center block shadow-2xl shadow-orange-100' onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
