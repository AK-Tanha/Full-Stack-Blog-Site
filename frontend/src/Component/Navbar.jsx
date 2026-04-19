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
        <Link to="/" className='flex items-center gap-2 group'>
          <div className='bg-blue-600 text-white px-3 py-1 rounded-lg font-black text-xl italic group-hover:bg-blue-700 transition-colors'>
            CCB
          </div>
          <span className='text-xl font-black tracking-tighter uppercase hidden sm:block'>
            Combat <span className='text-blue-600'>Corner</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className='hidden lg:flex items-center gap-8'>
          {navLists.map((list, index) => (
            <li key={index}>
              <NavLink
                to={list.path}
                className={({ isActive }) =>
                  `text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full ${
                    isActive ? "text-blue-600 after:w-full" : "text-gray-900 hover:text-blue-600"
                  }`
                }>
                {list.name}
              </NavLink>
            </li>
          ))}

          <div className='h-6 w-[1px] bg-gray-200 mx-2'></div>

          {user ? (
            <li className='flex items-center gap-4'>
              <Link to={user.role === 'admin' ? "/dashboard" : "/profile"} className='flex items-center gap-2 group'>
                <img src={avatarImg} alt="avatar" className='w-9 h-9 rounded-full border-2 border-transparent group-hover:border-blue-600 transition-all' />
                <span className='text-sm font-bold text-gray-900'>{user.username}</span>
              </Link>
              <button
                onClick={hanDelLogout}
                className='text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors'>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink
                to="/log-in"
                className='bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200'>
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
          <div className='p-6 flex flex-col h-full'>
            <div className='flex items-center justify-between mb-10'>
              <span className='text-xl font-black uppercase tracking-tighter'>
                Combat <span className='text-blue-600'>Corner</span>
              </span>
              <button onClick={() => setIsMenuOpen(false)} className='p-2 bg-gray-100 rounded-full'><IoCloseSharp /></button>
            </div>

            <ul className='flex flex-col gap-6 mb-auto'>
              {navLists.map((list, index) => (
                <li key={index}>
                  <NavLink
                    to={list.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-bold uppercase tracking-widest ${isActive ? "text-blue-600" : "text-gray-900"}`
                    }>
                    {list.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className='mt-10 pt-10 border-t border-gray-100'>
              {user ? (
                <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-3'>
                    <img src={avatarImg} alt="avatar" className='w-12 h-12 rounded-full border-2 border-blue-600' />
                    <div>
                      <p className='font-bold text-gray-900'>{user.username}</p>
                      <p className='text-xs text-gray-500 capitalize'>{user.role}</p>
                    </div>
                  </div>
                  <Link to={user.role === 'admin' ? "/dashboard" : "/profile"} className='w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-center' onClick={() => setIsMenuOpen(false)}>
                    Go to Dashboard
                  </Link>
                  <button onClick={hanDelLogout} className='w-full py-3 border border-red-200 text-red-600 rounded-xl font-bold'>
                    Log Out
                  </button>
                </div>
              ) : (
                <NavLink to="/log-in" className='w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-center block shadow-xl shadow-blue-100' onClick={() => setIsMenuOpen(false)}>
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
